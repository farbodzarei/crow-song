/* ============================================================================
   Crow — the client’s geometric crow (cs_crow_geometric.svg). Geometry kept
   faithful; the named body parts (Head, Wing L/R, Body, Tail) drive the
   assemble order.

   Motion:
     • Draw-in:  every stroke draws itself (pathLength 0→1) + fades, staggered
                 by body part — sacred circles → body → head → wings → tail →
                 flight lines → accent dots.
     • Breath:   the whole mark drifts + scales a hair, forever, slowly.
     • Scroll:   as you leave the hero it lifts, banks, and fades.
   Reduced motion: renders fully-formed and still.
   ========================================================================== */

import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { ease } from "../tokens/motion.js";
import styles from "./Crow.module.css";

const LV = "235,224,255"; // #ebe0ff
const SF = "196,184,214"; // #c4b8d6

// Stroke/facet elements — draw via pathLength, in this (body-part) order.
const STROKES = [
  // sacred circles
  { t: "circle", a: { cx: 69.26, cy: 69.26, r: 69.18 }, s: `rgba(${SF},0.22)`, w: 0.3 },
  { t: "circle", a: { cx: 69.26, cy: 69.26, r: 56.6 }, s: `rgba(${SF},0.16)`, w: 0.3 },
  // body
  { t: "polygon", a: { points: "69.26,31.52 91.27,56.68 69.26,94.41 47.25,56.68" }, s: `rgba(${LV},0.5)`, w: 0.5, f: `rgba(${SF},0.05)` },
  { t: "line", a: { x1: 69.26, y1: 31.52, x2: 69.26, y2: 94.41 }, s: `rgba(${SF},0.3)`, w: 0.3 },
  { t: "line", a: { x1: 69.26, y1: 56.68, x2: 69.26, y2: 138.43 }, s: `rgba(${LV},0.12)`, w: 0.25 },
  // head + beak + eye ring
  { t: "polygon", a: { points: "69.26,18.95 75.55,31.52 62.97,31.52" }, s: `rgba(${SF},0.6)`, w: 0.45, f: `rgba(${SF},0.06)` },
  { t: "polygon", a: { points: "69.26,18.95 79.32,16.43 75.55,25.23" }, s: `rgba(${LV},0.5)`, w: 0.4, f: `rgba(${LV},0.05)` },
  { t: "circle", a: { cx: 72.4, cy: 25.23, r: 2.52 }, s: `rgba(${LV},0.3)`, w: 0.3 },
  // wing left
  { t: "polygon", a: { points: "47.25,56.68 12.66,37.81 25.23,69.26 47.25,69.26" }, s: `rgba(${LV},0.45)`, w: 0.4, f: `rgba(${SF},0.05)` },
  { t: "line", a: { x1: 47.25, y1: 56.68, x2: 12.66, y2: 37.81 }, s: `rgba(${SF},0.25)`, w: 0.3 },
  { t: "line", a: { x1: 47.25, y1: 56.68, x2: 18.95, y2: 50.39 }, s: `rgba(${SF},0.2)`, w: 0.3 },
  // wing right
  { t: "polygon", a: { points: "91.27,56.68 125.86,37.81 113.28,69.26 91.27,69.26" }, s: `rgba(${LV},0.45)`, w: 0.4, f: `rgba(${SF},0.05)` },
  { t: "line", a: { x1: 91.27, y1: 56.68, x2: 125.86, y2: 37.81 }, s: `rgba(${SF},0.25)`, w: 0.3 },
  { t: "line", a: { x1: 91.27, y1: 56.68, x2: 119.57, y2: 50.39 }, s: `rgba(${SF},0.2)`, w: 0.3 },
  // tail (left / centre / right feathers)
  { t: "polygon", a: { points: "69.26,94.41 47.25,125.86 58.18,103.22" }, s: `rgba(${LV},0.4)`, w: 0.4, f: `rgba(${SF},0.04)` },
  { t: "polygon", a: { points: "69.26,94.41 71.14,103.22 69.26,125.23 67.37,103.22" }, s: `rgba(${LV},0.45)`, w: 0.4, f: `rgba(${SF},0.05)` },
  { t: "polygon", a: { points: "80.33,103.22 91.27,125.86 69.26,94.41" }, s: `rgba(${LV},0.4)`, w: 0.4, f: `rgba(${SF},0.04)` },
  // flight lines
  { t: "line", a: { x1: 69.26, y1: 56.68, x2: 6.37, y2: 25.23 }, s: `rgba(${LV},0.15)`, w: 0.25 },
  { t: "line", a: { x1: 69.26, y1: 56.68, x2: 132.15, y2: 25.23 }, s: `rgba(${LV},0.15)`, w: 0.25 },
];

// Filled accent dots — fade/pop in after the lines.
const DOTS = [
  { cx: 72.4, cy: 25.23, r: 1.1, f: `rgba(${LV},0.7)` }, // eye
  { cx: 12.66, cy: 37.81, r: 0.8, f: `rgba(${SF},0.45)` },
  { cx: 125.86, cy: 37.81, r: 0.8, f: `rgba(${SF},0.45)` },
  { cx: 47.25, cy: 125.86, r: 0.8, f: `rgba(${SF},0.4)` },
  { cx: 91.27, cy: 125.86, r: 0.8, f: `rgba(${SF},0.4)` },
  { cx: 69.26, cy: 125.23, r: 0.8, f: `rgba(${SF},0.35)` },
];

const VB = "0 0 138.51 138.51";

function StaticArt() {
  return (
    <svg viewBox={VB} className={styles.svg}>
      {STROKES.map((e, i) => {
        const Tag = e.t;
        return <Tag key={i} {...e.a} fill={e.f || "none"} stroke={e.s} strokeWidth={e.w} strokeLinecap="round" strokeLinejoin="round" />;
      })}
      {DOTS.map((d, i) => (
        <circle key={`d${i}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.f} />
      ))}
    </svg>
  );
}

// back-and-forth: "visible" draws each stroke on (pathLength 0→1); "hidden"
// reverses it (1→0). The loop yoyos between them with a pause in between.
const draw = {
  hidden: { pathLength: 0, opacity: 0, transition: { pathLength: { duration: 1.15, ease }, opacity: { duration: 0.9, ease } } },
  visible: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 1.0, ease }, opacity: { duration: 0.5, ease } } },
};
const pop = {
  hidden: { opacity: 0, transition: { duration: 0.6, ease } },
  visible: { opacity: 1, transition: { duration: 0.6, ease } },
};
const container = {
  // un-draw in reverse order (last stroke retracts first) for a clean rewind
  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  // no delayChildren — the instant the loading curtain lifts, the crow starts drawing
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0 } },
};
// a wing/flight group: transparent orchestrator so its strokes still draw in
// sequence within the parent's stagger (the group itself carries the scroll
// transform that makes the crow take flight).
const group = {
  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  visible: { transition: { staggerChildren: 0.05 } },
};
// the aura tracks the crow: fades in as it forms, out as it reverses
const glow = {
  hidden: { opacity: 0, transition: { duration: 1.1, ease } },
  visible: { opacity: 1, transition: { duration: 1.3, ease } },
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// resolves once the loading curtain is gone (flag covers the mount race)
function whenIntroDone() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || window.__csIntroDone) return resolve();
    const on = () => { window.removeEventListener("cs-intro-done", on); resolve(); };
    window.addEventListener("cs-intro-done", on);
  });
}

// render one stroke element (shared by load + flight render)
function Stroke({ e, k }) {
  const Tag = motion[e.t];
  return (
    <Tag key={k} {...e.a} fill={e.f || "none"} stroke={e.s} strokeWidth={e.w} strokeLinecap="round" strokeLinejoin="round" variants={draw} />
  );
}

export default function Crow({ className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const drawControls = useAnimationControls();

  // draw-in starts only once the loading curtain is gone (so it's seen), then
  // yoyos back and forth: form → 5s → reverse (un-draw) → 5s → form …
  useEffect(() => {
    if (reduce) return;
    let alive = true;
    (async () => {
      await whenIntroDone();
      while (alive) {
        await drawControls.start("visible"); // form
        if (!alive) break;
        await wait(5000); // hold formed
        if (!alive) break;
        await drawControls.start("hidden"); // reverse (un-draw) — then re-form immediately
      }
    })();
    return () => {
      alive = false;
    };
  }, [reduce, drawControls]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // take flight: the whole mark rises + scales toward the viewer and fades,
  // while the wings beat open from their shoulders and the flight lines release.
  const y = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -7]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.92], [1, 0]);
  // wings articulate up-and-out around each shoulder (signs mirror each other)
  const wingL = useTransform(scrollYProgress, [0, 0.55], [0, 28]);
  const wingR = useTransform(scrollYProgress, [0, 0.55], [0, -28]);
  // flight lines lift away and dissolve a touch ahead of the body
  const flightY = useTransform(scrollYProgress, [0, 0.6], [0, -26]);
  const flightO = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const wingLStyle = { rotate: wingL, transformBox: "view-box", transformOrigin: "47.25px 56.68px" };
  const wingRStyle = { rotate: wingR, transformBox: "view-box", transformOrigin: "91.27px 56.68px" };
  const flightStyle = { y: flightY, opacity: flightO, transformBox: "view-box", transformOrigin: "69.26px 56.68px" };

  // ── cursor interaction ────────────────────────────────────────────────────
  // The mark behaves like a lit object you can turn: it banks in 3D toward the
  // pointer (rotateX/rotateY off the crow-relative cursor position), brightens
  // as the cursor approaches, and sheds tiny luminous motes as the cursor moves
  // across it. px/py are the pointer offset from the crow centre, −1..1.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 130, damping: 16, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-1, 1], [16, -16]), spring);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-20, 20]), spring);
  const boost = useSpring(0, { stiffness: 90, damping: 20 });
  const brightness = useTransform(boost, [0, 1], [1, 1.55]);
  const filter = useMotionTemplate`brightness(${brightness})`;

  useEffect(() => {
    if (reduce) return;
    const live = new Set();
    let lsx = 0;
    let lsy = 0;
    // one mote: a fixed luminous dot at the pointer that drifts up + fades out
    const spawn = (x, y) => {
      const m = document.createElement("span");
      m.className = styles.mote;
      const size = 2 + Math.random() * 2.6;
      m.style.left = `${x + (Math.random() - 0.5) * 16}px`;
      m.style.top = `${y + (Math.random() - 0.5) * 16}px`;
      m.style.width = `${size}px`;
      m.style.height = `${size}px`;
      document.body.appendChild(m);
      live.add(m);
      const dx = (Math.random() - 0.5) * 36;
      const dy = -(18 + Math.random() * 38);
      const a = m.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 0.7 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.15)`, opacity: 0 },
        ],
        { duration: 820 + Math.random() * 720, easing: "cubic-bezier(0.22,1,0.36,1)" }
      );
      a.onfinish = () => {
        live.delete(m);
        m.remove();
      };
    };
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = (e.clientX - cx) / (r.width / 2);
      const ny = (e.clientY - cy) / (r.height / 2);
      const dist = Math.hypot(nx, ny);
      // bank toward the cursor while it's anywhere near; ease flat when far
      if (dist < 2.2) {
        px.set(Math.max(-1, Math.min(1, nx)));
        py.set(Math.max(-1, Math.min(1, ny)));
      } else {
        px.set(0);
        py.set(0);
      }
      boost.set(Math.max(0, 1 - dist / 1.25));
      // shed motes only while the cursor is over the mark, throttled by travel
      if (dist < 0.92) {
        const mdx = e.clientX - lsx;
        const mdy = e.clientY - lsy;
        if (mdx * mdx + mdy * mdy > 180) {
          spawn(e.clientX, e.clientY);
          lsx = e.clientX;
          lsy = e.clientY;
        }
      }
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
      boost.set(0);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      live.forEach((m) => m.remove());
      live.clear();
    };
  }, [reduce, px, py, boost]);

  // body-part slices (indices match the STROKES order / draw-in cascade)
  const pre = STROKES.slice(0, 8); // sacred circles + body + head
  const leftWing = STROKES.slice(8, 11);
  const rightWing = STROKES.slice(11, 14);
  const tail = STROKES.slice(14, 17);
  const flight = STROKES.slice(17, 19);

  if (reduce) {
    return (
      <div ref={ref} className={`${styles.wrap} ${className}`} aria-hidden="true">
        <div className={styles.glowWrap}>
          <div className={styles.glowPulse} />
        </div>
        <StaticArt />
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={`${styles.wrap} ${className}`} aria-hidden="true" style={{ y, rotate, scale, opacity }}>
      {/* 3D tilt layer — banks toward the cursor and brightens on approach.
          transformPerspective gives the rotation real depth; the aura + mark
          both live inside it so they turn together. */}
      <motion.div className={styles.tilt} style={{ rotateX, rotateY, filter, transformPerspective: 900 }}>
      {/* aura — fades in/out with the crow's form/reverse (same controls) */}
      <motion.div className={styles.glowWrap} variants={glow} initial="hidden" animate={drawControls}>
        <div className={styles.glowPulse} />
      </motion.div>
      {/* load draw-in scale — no delay, so the crow is already arriving the
          instant the loading curtain lifts */}
      <motion.div className={styles.breath} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.0, ease, delay: 0 }}>
        {/* perpetual breath — a slow human/ujjayi cycle: a fuller, quicker
            inhale (rise + expand), a brief hold, a longer easing exhale, then
            a moment of rest before the next breath. Asymmetric on purpose.
            Opacity kept low + swinging so the mark shimmers, fading in and out
            like breath on glass rather than sitting as a solid graphic. */}
        <motion.div
          className={styles.breath}
          animate={{
            scale: [1, 1.055, 1.055, 1, 1],
            y: [0, -7, -7, 0, 0],
            opacity: [0.32, 0.55, 0.5, 0.36, 0.32],
          }}
          transition={{
            duration: 7,
            times: [0, 0.34, 0.42, 0.92, 1],
            ease: ["easeOut", "linear", "easeInOut", "linear"],
            repeat: Infinity,
            repeatDelay: 0.5, // the pause at the bottom of the breath
          }}
        >
          <motion.svg viewBox={VB} className={styles.svg} variants={container} initial="hidden" animate={drawControls}>
            {pre.map((e, i) => <Stroke key={`p${i}`} e={e} k={`p${i}`} />)}
            <motion.g variants={group} style={wingLStyle}>
              {leftWing.map((e, i) => <Stroke key={`l${i}`} e={e} k={`l${i}`} />)}
            </motion.g>
            <motion.g variants={group} style={wingRStyle}>
              {rightWing.map((e, i) => <Stroke key={`r${i}`} e={e} k={`r${i}`} />)}
            </motion.g>
            {tail.map((e, i) => <Stroke key={`t${i}`} e={e} k={`t${i}`} />)}
            <motion.g variants={group} style={flightStyle}>
              {flight.map((e, i) => <Stroke key={`f${i}`} e={e} k={`f${i}`} />)}
            </motion.g>
            {DOTS.map((d, i) => (
              <motion.circle key={`d${i}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.f} variants={pop} />
            ))}
          </motion.svg>
        </motion.div>
      </motion.div>
      </motion.div>
    </motion.div>
  );
}
