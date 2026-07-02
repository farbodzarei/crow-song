/* ============================================================================
   Reveal — scroll-into-view wrapper for the gentle, breath-like reveals.
   - Wrap any element; it surfaces once when it enters the viewport.
   - `variant` picks how it arrives: "rise" | "riseSmall" | "fade" | "scaleIn"
     | "breath" — choose the one that fits the element (avoid one uniform
     entrance everywhere).
   - `stagger` on a parent + `item` on children sequences them into a soft cascade.
   - `breathe` makes it flow OUT as it leaves and re-form as it returns
     (once:false). Use on signature moments, not body copy.
   - Respects prefers-reduced-motion: collapses to a plain (instant) render.
   ========================================================================== */

import { motion, useReducedMotion } from "motion/react";
import {
  fadeRise,
  fadeRiseSmall,
  fade,
  scaleIn,
  cardReveal,
  breath,
  lineMask,
  stagger as staggerVariant,
  viewportOnce,
  viewportBreathe,
} from "../tokens/motion.js";

const VARIANTS = {
  rise: fadeRise,
  riseSmall: fadeRiseSmall,
  fade,
  scaleIn,
  card: cardReveal,
  breath,
  lineMask,
};

export default function Reveal({
  as = "div",
  variant = "rise", // "rise" | "riseSmall" | "fade" | "scaleIn" | "breath"
  stagger = false, // true → become a staggering parent
  staggerGap = 0.14,
  delayChildren = 0.05,
  item = false, // true → this is a child inside a staggering parent
  breathe = false, // true → flow in AND out (re-fires both directions)
  className,
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  const viewport = breathe ? viewportBreathe : viewportOnce;

  // Reduced motion: render visible immediately, no transform/blur.
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
        viewport={viewport}
        {...rest}
      >
        {children}
      </MotionTag>
    );
  }

  // A child inside a staggering parent: inherits parent’s orchestration.
  if (item) {
    return (
      <MotionTag className={className} variants={VARIANTS[variant] || fadeRise} {...rest}>
        {children}
      </MotionTag>
    );
  }

  // Standalone reveal.
  return (
    <MotionTag
      className={className}
      variants={VARIANTS[variant] || fadeRise}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
