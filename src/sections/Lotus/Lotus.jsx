/* ============================================================================
   LOTUS — the "lotus of life": a mandala of hundreds of tiny lavender particles
   that begin scattered and drift inward, blooming from the seed-pod outward
   until the full flower completes — mounted as a FIXED OVERLAY on the home page.
   It switches on right as the Hero scrolls away and forms over the content
   beneath as you keep scrolling, then fades.

   Overlay mechanics
     • Renders a zero-height anchor in normal flow (placed right after the Hero),
       plus a position:fixed canvas. The anchor's viewport position is the
       trigger — it tells us exactly where the Hero ends.
     • Adds NO scroll length and is pointer-events:none, so it never disturbs
       layout or blocks clicks. Bloom + opacity are driven from that window.

   Canvas (not DOM) so ~1500 motes stay cheap. rAF pauses on hidden tab.
   Reduced motion: the completed lotus, still, faint. Decorative (aria-hidden).
   ========================================================================== */

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./Lotus.module.css";

/* ── Lotus geometry ─────────────────────────────────────────────────────────
   Normalised space: centre = (0,0), the flower reaches a radius of ~1.15. Each
   tier is a ring of pointed petals; alternate tiers offset by half a petal so
   they interleave. Returns {x, y, w} where w is a brightness/size weight.      */
const TIERS = [
  { count: 6, ri: 0.05, rt: 0.40, w: 0.42, edge: 26, fill: 30, offset: false },
  { count: 10, ri: 0.09, rt: 0.64, w: 0.34, edge: 30, fill: 34, offset: true },
  { count: 14, ri: 0.15, rt: 0.90, w: 0.27, edge: 34, fill: 36, offset: false },
  { count: 18, ri: 0.28, rt: 1.15, w: 0.21, edge: 38, fill: 36, offset: true },
];

// module-level (not in render) so the Math.random sampling stays out of React's
// purity rules; called once via useMemo.
function buildLotusPoints() {
  const pts = [];
  const push = (x, y, w) => pts.push({ x, y, w });

  // seed pod — a tight golden-ratio spiral of motes at the heart
  const SEED = 70;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < SEED; i++) {
    const r = 0.052 * Math.sqrt(i / SEED);
    const a = i * golden;
    push(Math.cos(a) * r, Math.sin(a) * r, 0.6);
  }

  for (const tier of TIERS) {
    const base = tier.offset ? Math.PI / tier.count : 0;
    for (let p = 0; p < tier.count; p++) {
      const phi = base + (p / tier.count) * Math.PI * 2;

      // two outline edges + the central vein of each petal
      for (let s = 0; s <= tier.edge; s++) {
        const u = s / tier.edge;
        const r = tier.ri + (tier.rt - tier.ri) * u;
        const taper = Math.pow(Math.sin(Math.PI * u), 0.7); // 0 at base/tip, fat mid
        for (const side of [-1, 1]) {
          const ang = phi + side * tier.w * taper;
          push(Math.cos(ang) * r, Math.sin(ang) * r, u > 0.86 ? 1 : 0.5); // tips bright
        }
        if (s % 2 === 0) push(Math.cos(phi) * r, Math.sin(phi) * r, 0.7); // vein
      }

      // soft interior fill so the petal reads solid, not just outlined
      for (let f = 0; f < tier.fill; f++) {
        const u = 0.12 + Math.random() * 0.82;
        const r = tier.ri + (tier.rt - tier.ri) * u;
        const taper = Math.pow(Math.sin(Math.PI * u), 0.7);
        const ang = phi + (Math.random() * 2 - 1) * tier.w * taper * 0.92;
        push(Math.cos(ang) * r, Math.sin(ang) * r, 0.32 + Math.random() * 0.2);
      }
    }
  }
  return pts;
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export default function Lotus({ className = "" }) {
  const reduce = useReducedMotion();
  const anchorRef = useRef(null);
  const canvasRef = useRef(null);

  // normalised geometry (built once)
  const points = useMemo(() => buildLotusPoints(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let scale = 1;
    let raf = 0;
    let running = true;
    let t0 = 0;

    // per-particle traits: home (geometry), staggered bloom window, look.
    // The flower scales from a tight seed (ball) out to full — petals bloom
    // centre-first, rim-last, so it opens like a real lotus.
    const parts = points.map((pt) => {
      const homeR = Math.hypot(pt.x, pt.y);
      const order = Math.min(1, homeR / 1.15); // centre forms first, rim last
      const start = order * 0.6; // bloom window staggered by radius
      return {
        hx: pt.x,
        hy: pt.y,
        t0: start,
        t1: Math.min(1, start + 0.42),
        r: 0.5 + pt.w * 1.7,
        a: 0.18 + pt.w * 0.48, // a touch softer so content reads through
        bright: pt.w > 0.85,
        phase: Math.random() * Math.PI * 2,
        tw: 0.6 + Math.random() * 1.6,
      };
    });
    let aboutEl = null; // christine's section — where the flower blooms again

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      scale = Math.hypot(w, h) * 0.46; // reach into the corners — fills the screen
    };

    const draw = (ts) => {
      if (!t0) t0 = ts;
      const time = (ts - t0) / 1000;
      const vh = window.innerHeight || 1;

      // Choreography (reversed): the flower starts FULL in the Hero, contracts to
      // a tight seed/ball as the Hero scrolls away, then blooms all out again as
      // christine's (About) section arrives.
      const anchorTop = anchor.getBoundingClientRect().top; // Hero-end marker
      if (!aboutEl) aboutEl = document.getElementById("lotus-bloom");
      const aboutTop = aboutEl ? aboutEl.getBoundingClientRect().top : vh * 5;

      const contractP = clamp01((vh - anchorTop) / (vh * 0.9)); // 0 at Hero → 1 = ball
      const bloomP = clamp01((vh * 0.95 - aboutTop) / (vh * 0.8)); // 0 → 1 at About
      const formF = reduce ? 1 : Math.max(1 - contractP, bloomP); // 1·ball·1

      // opacity: present from the Hero through christine's, then fade as it leaves.
      // Softened over the Hero so the locked headline stays readable.
      const heroFull = (1 - contractP) * (1 - bloomP);
      const fadeOut = clamp01((-aboutTop - vh * 0.55) / (vh * 0.7));
      const visible = reduce ? 0.45 : (1 - fadeOut) * (1 - 0.45 * heroFull);
      canvas.parentElement.style.opacity = visible;

      ctx.clearRect(0, 0, w, h);
      if (visible <= 0.001) {
        if (running) raf = requestAnimationFrame(draw);
        return;
      }

      const rot = reduce ? 0 : time * 0.02 + (window.scrollY || 0) * 0.00016;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const breath = reduce ? 0 : Math.sin(time * 0.8) * 0.01; // seed breathes

      for (const m of parts) {
        const local = smooth(m.t0, m.t1, formF);
        const e = easeOutCubic(local);
        // particle scale: a dense breathing seed/ball → 100% (full flower)
        const ps = 0.085 + breath * (1 - e) + 0.915 * e;

        const hx = m.hx * cosR - m.hy * sinR;
        const hy = m.hx * sinR + m.hy * cosR;
        let x = hx * ps;
        let y = hy * ps;

        const shimmer = reduce ? 0 : 0.005 * local;
        x += Math.sin(time * m.tw + m.phase) * shimmer;
        y += Math.cos(time * m.tw * 0.9 + m.phase) * shimmer;

        const twinkle = reduce ? 1 : 0.8 + 0.2 * Math.sin(time * m.tw + m.phase);
        const alpha = m.a * (0.4 + 0.6 * local) * twinkle;

        ctx.beginPath();
        ctx.arc(cx + x * scale, cy + y * scale, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.bright
          ? `rgba(235, 224, 255, ${alpha})` // bright lavender — tips & veins
          : `rgba(196, 184, 214, ${alpha})`; // soft lavender — petal body
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        t0 = 0;
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [points, reduce]);

  return (
    <>
      {/* zero-height trigger placed right after the Hero — marks where it ends */}
      <div ref={anchorRef} className={styles.anchor} aria-hidden="true" />
      <div className={`${styles.overlay} ${className}`} aria-hidden="true">
        <div className={styles.glow} />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </>
  );
}
