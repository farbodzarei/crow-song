/* ============================================================================
   Mandala — thin-line 8-fold sacred geometry (Ashtanga = "eight limbs").
   It FORMS as you scroll: the figure constructs itself from the centre outward
   — bindu → inner ring → inner lotus → mid ring → outer lotus → outer ring/ticks
   — each layer drawing its lines on (pathLength) across a slice of scroll.
   Its centre is pinned to a section corner (≈3/4 bleeds off), and it rotates
   slowly. Reduced motion → fully drawn + still.

   Props: side "left"|"right" · tone "onDark"|"onLight" · className
   ========================================================================== */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import styles from "./Mandala.module.css";

const P = (a) => (a * Math.PI) / 180;
const pt = (r, a) => [+(r * Math.cos(P(a))).toFixed(2), +(r * Math.sin(P(a))).toFixed(2)];
function petal(ri, ro, a, half) {
  const [bx, by] = pt(ri, a);
  const [tx, ty] = pt(ro, a);
  const rm = ri + (ro - ri) * 0.55;
  const [l1x, l1y] = pt(rm, a - half);
  const [r1x, r1y] = pt(rm, a + half);
  return `M ${bx} ${by} Q ${l1x} ${l1y} ${tx} ${ty} Q ${r1x} ${r1y} ${bx} ${by} Z`;
}

const innerPetals = Array.from({ length: 8 }, (_, i) => petal(34, 68, i * 45 + 22.5, 15));
const outerPetals = Array.from({ length: 16 }, (_, i) => petal(70, 102, i * 22.5, 7.5));
const ticks = Array.from({ length: 24 }, (_, i) => {
  const [x1, y1] = pt(102, i * 15);
  const [x2, y2] = pt(110, i * 15);
  return { x1, y1, x2, y2 };
});
const tipDots = Array.from({ length: 8 }, (_, i) => pt(68, i * 45 + 22.5));

export default function Mandala({ side = "right", tone = "onLight", className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // each layer draws across its own slice of the section's pass → builds outward
  const l1 = useTransform(scrollYProgress, [0.05, 0.18], [0, 1], { clamp: true });
  const l2 = useTransform(scrollYProgress, [0.14, 0.32], [0, 1], { clamp: true });
  const l3 = useTransform(scrollYProgress, [0.28, 0.38], [0, 1], { clamp: true });
  const l4 = useTransform(scrollYProgress, [0.34, 0.56], [0, 1], { clamp: true });
  const l5 = useTransform(scrollYProgress, [0.5, 0.68], [0, 1], { clamp: true });

  const stroke = tone === "onLight" ? "#6E5E90" : "#C9BEDD";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke",
  };

  // draw a stroked element; pathLength is scroll-linked unless reduced motion
  const S = (key, Tag, attrs, pl) =>
    reduce ? (
      <Tag key={key} {...attrs} {...common} />
    ) : (
      <motion.g key={key}>
        {Tag === "path" ? (
          <motion.path {...attrs} {...common} style={{ pathLength: pl }} />
        ) : Tag === "circle" ? (
          <motion.circle {...attrs} {...common} style={{ pathLength: pl }} />
        ) : (
          <motion.line {...attrs} {...common} style={{ pathLength: pl }} />
        )}
      </motion.g>
    );
  // filled accent dots reveal by opacity
  const D = (key, attrs, pl) =>
    reduce ? (
      <circle key={key} {...attrs} fill={stroke} fillOpacity="0.6" />
    ) : (
      <motion.circle key={key} {...attrs} fill={stroke} fillOpacity="0.6" style={{ opacity: pl }} />
    );

  return (
    <div ref={ref} className={`${styles.mandala} ${styles[side]} ${styles[tone]} ${className}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="-120 -120 240 240">
        {/* L1 — centre */}
        {S("r34", "circle", { cx: 0, cy: 0, r: 34 }, l1)}
        {S("r7", "circle", { cx: 0, cy: 0, r: 7 }, l1)}
        {D("bindu", { cx: 0, cy: 0, r: 2.4 }, l1)}
        {/* L2 — inner 8-petal lotus */}
        {innerPetals.map((d, i) => S(`ip${i}`, "path", { d }, l2))}
        {tipDots.map(([x, y], i) => D(`td${i}`, { cx: x, cy: y, r: 1.1 }, l2))}
        {/* L3 — mid ring */}
        {S("r70", "circle", { cx: 0, cy: 0, r: 70 }, l3)}
        {/* L4 — outer 16-petal lotus */}
        {outerPetals.map((d, i) => S(`op${i}`, "path", { d }, l4))}
        {/* L5 — outer rings + tick dial */}
        {S("r102", "circle", { cx: 0, cy: 0, r: 102 }, l5)}
        {S("r110", "circle", { cx: 0, cy: 0, r: 110 }, l5)}
        {ticks.map((t, i) => S(`tk${i}`, "line", t, l5))}
      </svg>
    </div>
  );
}
