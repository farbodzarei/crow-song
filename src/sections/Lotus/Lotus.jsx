/* ============================================================================
   LOTUS — the "lotus of life". A mandala of many hundreds of tiny lavender
   particles that begin scattered and drift inward, blooming from the seed-pod
   outward until the full lotus completes at the end of the scroll.

   How it works
     • A tall section (250vh) with a sticky 100vh stage. useScroll maps the
       scroll through that span to progress 0→1.
     • Every particle has a HOME on the lotus geometry and a SCATTER point out
       in the dark. Progress lerps each particle from scatter→home.
     • Each particle's build window is ordered by its distance from centre, so
       the flower opens from the middle out (a bloom), fully formed at p=1.
     • Canvas (not DOM) so ~1500 motes stay cheap. rAF pauses on hidden tab.

   Reduced motion: renders the completed lotus, still. Decorative (aria-hidden).

   Standalone by design — NOT mounted in App.jsx. To use it, drop one line in:
       import Lotus from "./sections/Lotus/Lotus.jsx";
       …
       <Lotus />
   ========================================================================== */

import { useEffect, useMemo, useRef } from "react";
import { useScroll, useReducedMotion } from "motion/react";
import styles from "./Lotus.module.css";

/* ── Lotus geometry ─────────────────────────────────────────────────────────
   Normalised space: centre = (0,0), the flower reaches a radius of ~1.15.
   Each tier is a ring of pointed petals; alternate tiers are offset by half a
   petal so they interleave like a real lotus. Returns {x, y, w} points where w
   is a brightness/size weight (veins + tips read a touch brighter).            */
const TIERS = [
  { count: 6, ri: 0.05, rt: 0.40, w: 0.42, edge: 26, fill: 30, offset: false },
  { count: 10, ri: 0.09, rt: 0.64, w: 0.34, edge: 30, fill: 34, offset: true },
  { count: 14, ri: 0.15, rt: 0.90, w: 0.27, edge: 34, fill: 36, offset: false },
  { count: 18, ri: 0.28, rt: 1.15, w: 0.21, edge: 38, fill: 36, offset: true },
];

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
        const taper = Math.pow(Math.sin(Math.PI * u), 0.7); // 0 at base/tip, fat in middle
        for (const side of [-1, 1]) {
          const ang = phi + side * tier.w * taper;
          push(Math.cos(ang) * r, Math.sin(ang) * r, u > 0.86 ? 1 : 0.5); // tips brighter
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
const smooth = (e0, e1, x) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export default function Lotus({ className = "" }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(reduce ? 1 : 0);

  // scroll across the 250vh section → 0..1 over the sticky stage
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // normalised geometry (built once); particle state derived from it
  const points = useMemo(() => buildLotusPoints(), []);

  useEffect(() => {
    if (reduce) {
      progressRef.current = 1;
    } else {
      const unsub = scrollYProgress.on("change", (v) => (progressRef.current = v));
      return unsub;
    }
  }, [reduce, scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    // per-particle traits: home (geometry), scatter origin, build window, look
    const parts = points.map((pt) => {
      const homeR = Math.hypot(pt.x, pt.y);
      const order = Math.min(1, homeR / 1.15); // centre forms first, rim last
      const start = order * 0.62; // build window staggered by radius
      // scatter: a random point out in the dark, with a swirl bias
      const sa = Math.random() * Math.PI * 2;
      const sr = 0.95 + Math.random() * 1.25;
      return {
        hx: pt.x,
        hy: pt.y,
        sx: Math.cos(sa) * sr,
        sy: Math.sin(sa) * sr,
        t0: start,
        t1: Math.min(1, start + 0.4),
        r: 0.5 + pt.w * 1.7, // px radius (pre-dpr)
        a: 0.22 + pt.w * 0.6, // base alpha
        bright: pt.w > 0.85, // tips/veins use the brighter ink
        phase: Math.random() * Math.PI * 2,
        tw: 0.6 + Math.random() * 1.6, // twinkle speed
      };
    });

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
      scale = Math.min(w, h) * 0.42;
    };

    const draw = (ts) => {
      if (!t0) t0 = ts;
      const time = (ts - t0) / 1000;
      const p = progressRef.current;
      // whole mandala turns a slow quarter-turn as it forms, then drifts on
      const rot = p * 0.42 + time * 0.015;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      ctx.clearRect(0, 0, w, h);

      for (const m of parts) {
        const local = smooth(m.t0, m.t1, p);
        const e = easeOutCubic(local);

        // home, rotated by the global spin
        const hx = m.hx * cosR - m.hy * sinR;
        const hy = m.hx * sinR + m.hy * cosR;

        // travel scatter → home
        let x = m.sx + (hx - m.sx) * e;
        let y = m.sy + (hy - m.sy) * e;

        // gentle living shimmer once it's near home
        const shimmer = 0.006 * local;
        x += Math.sin(time * m.tw + m.phase) * shimmer;
        y += Math.cos(time * m.tw * 0.9 + m.phase) * shimmer;

        // faint in flight, full once placed; soft twinkle throughout
        const twinkle = 0.78 + 0.22 * Math.sin(time * m.tw + m.phase);
        const alpha = m.a * (0.1 + 0.9 * local) * twinkle;

        ctx.beginPath();
        ctx.arc(cx + x * scale, cy + y * scale, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.bright
          ? `rgba(235, 224, 255, ${alpha})` // bright lavender ink — tips & veins
          : `rgba(196, 184, 214, ${alpha})`; // soft lavender — body of the petals
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
  }, [points]);

  return (
    <section ref={sectionRef} className={`${styles.lotus} ${className}`} aria-hidden="true">
      <div className={styles.stage}>
        <div className={styles.glow} />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </section>
  );
}
