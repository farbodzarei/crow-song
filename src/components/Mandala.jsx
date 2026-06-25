/* ============================================================================
   Mandala — the client's mandala (public/mandala.svg, extracted to mandalaPath)
   rendered as a STROKED path so it can draw its own exact lines. Its CENTRE is
   pinned to a section corner (so ~3/4 bleeds off — a rotating quadrant shows).
   - Draw:    pathLength is scroll-linked → the lines draw on as you scroll in.
   - Rotate:  the figure spins slowly (around its centre = the corner).
   Reduced motion → fully drawn + still.

   Props: side "left"|"right" · tone "onDark"|"onLight" · className
   ========================================================================== */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { MANDALA_VIEWBOX, MANDALA_TRANSFORM, MANDALA_D } from "./mandalaPath.js";
import styles from "./Mandala.module.css";

export default function Mandala({ side = "right", tone = "onLight", className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // draw the lines on across the first ~half of the section's pass through view
  const pathLength = useTransform(scrollYProgress, [0.04, 0.58], [0, 1]);
  const stroke = tone === "onLight" ? "#6E5E90" : "#C9BEDD";

  const pathProps = {
    d: MANDALA_D,
    fill: "none",
    stroke,
    strokeWidth: 1.4,
    vectorEffect: "non-scaling-stroke",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <div ref={ref} className={`${styles.mandala} ${styles[side]} ${styles[tone]} ${className}`} aria-hidden="true">
      <svg className={styles.svg} viewBox={MANDALA_VIEWBOX} preserveAspectRatio="xMidYMid meet">
        <g transform={MANDALA_TRANSFORM}>
          {reduce ? <path {...pathProps} /> : <motion.path {...pathProps} style={{ pathLength }} />}
        </g>
      </svg>
    </div>
  );
}
