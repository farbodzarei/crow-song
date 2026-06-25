/* ============================================================================
   Magnetic — the element eases toward the cursor while hovered, springing back
   on leave. A restrained, premium microinteraction for primary CTAs.
   Reduced-motion: renders inert (no transform).
   ========================================================================== */

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export default function Magnetic({ children, strength = 0.28, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 160, damping: 15, mass: 0.3 });

  if (reduce) {
    return <span className={className} style={{ display: "inline-block" }}>{children}</span>;
  }

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
