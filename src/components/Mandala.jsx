/* ============================================================================
   Mandala — the client's ornate mandala (public/mandala.svg) used as a CSS
   mask so we can recolour it to lavender and run a rotating shimmer *through*
   the geometry. It FORMS on scroll (a radial clip-path bloom) and SHIMMERS
   (a slow rotating conic-gradient sweeping light around the figure).
   Sits fully visible at a section corner (never cut off). Reduced motion →
   static + fully formed.

   Props: side "left"|"right" · tone "onDark"|"onLight" · className (offset)
   ========================================================================== */

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { ease } from "../tokens/motion.js";
import styles from "./Mandala.module.css";

const form = {
  hidden: { opacity: 0, clipPath: "circle(0% at 50% 50%)" },
  show: {
    opacity: 1,
    clipPath: "circle(78% at 50% 50%)",
    transition: { opacity: { duration: 1.1, ease }, clipPath: { duration: 1.6, ease } },
  },
};

export default function Mandala({ side = "right", tone = "onDark", className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  const cls = `${styles.mandala} ${styles[side]} ${styles[tone]} ${className}`;

  if (reduce) {
    return (
      <div ref={ref} className={cls} aria-hidden="true">
        <div className={styles.art}>
          <div className={styles.shimmer} />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cls} aria-hidden="true">
      <motion.div className={styles.art} variants={form} initial="hidden" animate={inView ? "show" : "hidden"}>
        <div className={styles.shimmer} />
      </motion.div>
    </div>
  );
}
