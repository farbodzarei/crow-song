/* ============================================================================
   Tilt — a restrained 3D parallax: the element rotates a few degrees toward the
   cursor and a soft light glare tracks the pointer across its surface, so it
   feels like a lit object you can turn. Springy, premium, never gimmicky.
   Reduced-motion (and touch, where there's no mousemove): renders inert + flat.
   ========================================================================== */

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

export default function Tilt({
  children,
  max = 7, // peak rotation in degrees
  glare = true,
  className = "",
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  // pointer position within the element, 0..1 (centre = 0.5)
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 150, damping: 18, mass: 0.4 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareBg = useTransform([sx, sy], ([x, y]) =>
    `radial-gradient(42% 42% at ${x * 100}% ${y * 100}%, rgba(244,242,246,0.22), transparent 72%)`
  );

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            mixBlendMode: "screen",
            background: glareBg,
          }}
        />
      )}
    </motion.div>
  );
}
