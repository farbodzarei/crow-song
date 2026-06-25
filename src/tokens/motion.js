/* ============================================================================
   MOTION TOKENS — JS mirror of the motion side of the design system.
   Every section animates through these, so cadence stays identical and
   reduced-motion is handled in ONE place (see Reveal.jsx).

   Cadence per brief: slow, unhurried, "like breath" — 0.9s–1.4s, slow ease-out.
   ========================================================================== */

// Slow ease-out, matches --ease-breath in tokens.css
export const ease = [0.16, 1, 0.3, 1];

export const duration = {
  fast: 0.6,
  slow: 1.1,
  slower: 1.4,
};

// Breakpoints (mirror of the values documented in tokens.css)
export const bp = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1200,
};

/* ── Shared variants ───────────────────────────────────────────────────────
   fadeRise: gentle opacity + small upward translate as an element enters.
   stagger:  parent that releases children in a soft sequence.              */

export const fadeRise = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slower, ease },
  },
};

// A slightly smaller rise for fine elements (labels, rules)
export const fadeRiseSmall = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease },
  },
};

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.slower, ease } },
};

// Parent container that staggers its children’s reveal
export const stagger = (staggerChildren = 0.12, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

// Default viewport config for scroll reveals — fire once, on the slightest
// entry. A low amount + no negative margin means even a fast fling can’t skip
// a section and leave it stuck hidden (content is never gated behind a missed
// trigger).
export const viewportOnce = { once: true, amount: 0.08, margin: "0px 0px -4% 0px" };
