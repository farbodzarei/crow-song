/* ============================================================================
   Mandala — 8-fold sacred geometry (Ashtanga = "eight limbs"). A double lotus
   (16 outer + 8 inner petals) inside concentric rings, drifting at a corner of
   a section, bleeding off-edge. It rotates very slowly (meditative) and "blooms"
   into form as the section scrolls into view. Reduced motion → static + still.

   Props:
     side  "left" | "right"   — which corner edge it bleeds off
     tone  "onDark" | "onLight" — stroke colour for the section's background
     className — extra positioning (vertical offset) from the section
   ========================================================================== */

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { ease } from "../tokens/motion.js";
import styles from "./Mandala.module.css";

const P = (a) => (a * Math.PI) / 180;
const pt = (r, a) => [+(r * Math.cos(P(a))).toFixed(2), +(r * Math.sin(P(a))).toFixed(2)];

function petalPath(ri, ro, a, half) {
  const [bx, by] = pt(ri, a);
  const [tx, ty] = pt(ro, a);
  const rm = ri + (ro - ri) * 0.55;
  const [l1x, l1y] = pt(rm, a - half);
  const [r1x, r1y] = pt(rm, a + half);
  return `M ${bx} ${by} Q ${l1x} ${l1y} ${tx} ${ty} Q ${r1x} ${r1y} ${bx} ${by} Z`;
}

// geometry as layered element arrays (so layers can bloom in sequence)
const rings = [
  { r: 110, o: 0.14, w: 0.5 },
  { r: 102, o: 0.26, w: 0.7 },
  { r: 70, o: 0.26, w: 0.7 },
  { r: 34, o: 0.22, w: 0.6 },
];
const outerPetals = Array.from({ length: 16 }, (_, i) => petalPath(70, 102, i * 22.5, 7.5));
const innerPetals = Array.from({ length: 8 }, (_, i) => petalPath(34, 68, i * 45 + 22.5, 15));
const ticks = Array.from({ length: 24 }, (_, i) => {
  const [x1, y1] = pt(102, i * 15);
  const [x2, y2] = pt(110, i * 15);
  return { x1, y1, x2, y2 };
});
const tipDots = Array.from({ length: 8 }, (_, i) => pt(68, i * 45 + 22.5));

const layer = {
  hidden: { opacity: 0, scale: 0.82 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.6, ease } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export default function Mandala({ side = "right", tone = "onDark", className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  // light haze needs more ink than the dark field to read at the same presence
  const stroke = tone === "onLight" ? "#6E5E90" : "#C9BEDD";
  const k = tone === "onLight" ? 1.85 : 1.45;
  const o = (b) => Math.min(0.9, +(b * k).toFixed(3));
  const ww = tone === "onLight" ? 1.15 : 1; // a hair thicker on light

  const Svg = (
    <svg viewBox="-120 -120 240 240" className={styles.svg} aria-hidden="true">
      {/* ticks */}
      {ticks.map((t, i) => (
        <line key={`t${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={stroke} strokeOpacity={o(0.18)} strokeWidth={0.5 * ww} />
      ))}
      {/* rings */}
      {rings.map((r, i) => (
        <circle key={`r${i}`} cx="0" cy="0" r={r.r} fill="none" stroke={stroke} strokeOpacity={o(r.o)} strokeWidth={r.w * ww} />
      ))}
      {/* outer lotus */}
      {outerPetals.map((d, i) => (
        <path key={`o${i}`} d={d} fill="none" stroke={stroke} strokeOpacity={o(0.26)} strokeWidth={0.6 * ww} />
      ))}
      {/* inner lotus */}
      {innerPetals.map((d, i) => (
        <path key={`i${i}`} d={d} fill="none" stroke={stroke} strokeOpacity={o(0.36)} strokeWidth={0.75 * ww} />
      ))}
      {/* tip dots + bindu */}
      {tipDots.map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="1.2" fill={stroke} fillOpacity={o(0.5)} />
      ))}
      <circle cx="0" cy="0" r="7" fill="none" stroke={stroke} strokeOpacity={o(0.4)} strokeWidth={0.6 * ww} />
      <circle cx="0" cy="0" r="2.4" fill={stroke} fillOpacity={o(0.6)} />
    </svg>
  );

  if (reduce) {
    return (
      <div ref={ref} className={`${styles.mandala} ${styles[side]} ${className}`} aria-hidden="true">
        {Svg}
      </div>
    );
  }

  return (
    <div ref={ref} className={`${styles.mandala} ${styles[side]} ${className}`} aria-hidden="true">
      {/* bloom: scale/opacity in when in view */}
      <motion.div
        className={styles.bloom}
        variants={layer}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {/* slow perpetual rotation (meditative) */}
        <motion.div
          className={styles.spin}
          animate={{ rotate: 360 }}
          transition={{ duration: 150, ease: "linear", repeat: Infinity }}
        >
          {Svg}
        </motion.div>
      </motion.div>
    </div>
  );
}
