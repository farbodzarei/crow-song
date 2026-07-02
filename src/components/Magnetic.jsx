/* ============================================================================
   Magnetic — the element eases toward the cursor while hovered, springing back
   on leave. A restrained, premium microinteraction for primary CTAs.
   Reduced-motion: renders inert (no transform).
   ========================================================================== */

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

export default function Magnetic({ children, strength = 0.28, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 160, damping: 15, mass: 0.3 });
  // Snap the offset to whole pixels. A magnetic pull moves tens of px, so 1px
  // rounding is invisible — but it keeps the letter-spaced text on an integer
  // compositing boundary, killing the faint vertical GPU seams that appeared
  // between glyphs when the layer sat at a fractional offset.
  const rx = useTransform(sx, (v) => Math.round(v));
  const ry = useTransform(sy, (v) => Math.round(v));

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
      style={{ x: rx, y: ry, display: "inline-block", backfaceVisibility: "hidden" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
