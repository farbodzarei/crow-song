/* ============================================================================
   Mandala — the client's Metatron's-Cube sacred geometry (public/mandala2.svg).
   Its fill IS thin lines, so we mask it (recolour to lavender) for clean line-
   art. It FORMS on scroll — a centre-out circular reveal grows from nothing to
   the full figure — its centre is pinned to a section corner, and it rotates.
   Reduced motion → fully revealed + still.

   Props: side "left"|"right" · tone "onDark"|"onLight" · className
   ========================================================================== */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useMotionTemplate } from "motion/react";
import styles from "./Mandala.module.css";

export default function Mandala({ side = "right", tone = "onLight", className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // forms from the centre outward across the section's pass through view
  const radius = useTransform(scrollYProgress, [0.05, 0.55], [0, 150], { clamp: true });
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 50%)`;
  // rotation is driven by scroll only (no auto-spin)
  const rotate = useTransform(scrollYProgress, [0, 1], [-40, 140]);

  return (
    <div ref={ref} className={`${styles.mandala} ${styles[side]} ${styles[tone]} ${className}`} aria-hidden="true">
      {reduce ? (
        <div className={styles.art} />
      ) : (
        <motion.div className={styles.art} style={{ clipPath, rotate }} />
      )}
    </div>
  );
}
