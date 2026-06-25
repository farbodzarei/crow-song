/* ============================================================================
   Reveal — scroll-into-view wrapper for the gentle fade + rise.
   - Wrap any element; it animates once when it enters the viewport.
   - Use `stagger` on a parent Reveal and `item` on children to sequence them.
   - Respects prefers-reduced-motion: collapses to a plain (instant) render.
   ========================================================================== */

import { motion, useReducedMotion } from "motion/react";
import {
  fadeRise,
  fadeRiseSmall,
  stagger as staggerVariant,
  viewportOnce,
} from "../tokens/motion.js";

const VARIANTS = {
  rise: fadeRise,
  riseSmall: fadeRiseSmall,
};

export default function Reveal({
  as = "div",
  variant = "rise", // "rise" | "riseSmall"
  stagger = false, // true → become a staggering parent
  staggerGap = 0.12,
  delayChildren = 0,
  item = false, // true → this is a child inside a staggering parent
  className,
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  // Reduced motion: render visible immediately, no transform.
  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  // A staggering parent: orchestrates children, no movement of its own.
  if (stagger) {
    return (
      <MotionTag
        className={className}
        variants={staggerVariant(staggerGap, delayChildren)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        {...rest}
      >
        {children}
      </MotionTag>
    );
  }

  // A child inside a staggering parent: inherits parent’s orchestration.
  if (item) {
    return (
      <MotionTag className={className} variants={VARIANTS[variant]} {...rest}>
        {children}
      </MotionTag>
    );
  }

  // Standalone reveal.
  return (
    <MotionTag
      className={className}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
