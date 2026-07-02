/* ============================================================================
   MOTION TOKENS — JS mirror of the motion side of the design system.
   Every section animates through these, so cadence stays identical and
   reduced-motion is handled in ONE place (see Reveal.jsx).

   Cadence per brief: slow, unhurried, "like breath" — elements don't snap in,
   they surface. A soft focus-pull (a little blur clearing as they rise) makes
   each reveal feel like an inhale bringing the element into focus, then settle.
   ========================================================================== */

// Slow ease-out — the exhale. Matches --ease-breath in tokens.css.
export const ease = [0.16, 1, 0.3, 1];
// Gentle symmetric in-out — for elements that flow BOTH ways (breathe mode),
// so leaving feels like the reverse of arriving, never an abrupt cut.
export const easeBreath = [0.37, 0, 0.63, 1];

export const duration = {
  fast: 0.6,
  slow: 1.1,
  slower: 1.4,
  breath: 1.8,
};

// Breakpoints (mirror of the values documented in tokens.css)
export const bp = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1200,
};

/* ── Shared variants ───────────────────────────────────────────────────────
   Each reveal should fit what it reveals — pick a variant per element rather
   than applying one uniform entrance everywhere (the uniform reflex is the
   tell, not motion itself). Transform + opacity + a small blur are all
   GPU-friendly; blur stays ≤6px and clears quickly so it never janks.        */

// fadeRise — the default. Surfaces upward, pulling into focus. Body sections.
export const fadeRise = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.slower, ease },
  },
};

// fadeRiseSmall — a shorter lift for fine elements (labels, rules, kickers).
export const fadeRiseSmall = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease },
  },
};

// fade — pure crossfade, no movement. For things already in their right place.
export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.slower, ease } },
};

// scaleIn — settles in from a hair smaller, focus clearing. Media, cards, the
// crow mark — anything that should feel like it's coming to rest, not sliding.
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.965, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: duration.slower, ease },
  },
};

// cardReveal — single panels (membership band). Unveils via a rising clip-path
// wipe with the panel ALWAYS at full opacity, so a dark panel never spends the
// fade as a grey block over the light field. It is masked open from the bottom
// edge up, lifting a touch as it lands. round 14px == --radius (keeps the wipe
// edge on the card's own rounded corners).
export const cardReveal = {
  hidden: { clipPath: "inset(100% 0% 0% 0% round 14px)", y: 30 },
  visible: {
    clipPath: "inset(0% 0% 0% 0% round 14px)",
    y: 0,
    transition: { duration: duration.slower, ease },
  },
};

// ── Card choreography ──────────────────────────────────────────────────────
// The award-level move: the tile is unveiled by a rising clip-path wipe — it is
// fully painted the entire time (no opacity fade, so it can NEVER read as a grey
// block assembling over a light field), then its contents cascade in (cardChild)
// — label, title, price, each line, CTA — so the card reads as composed, not
// stamped. cardShell is both a child of the grid stagger and a stagger parent of
// its own contents (when:beforeChildren). round 14px tracks --radius.
export const cardShell = {
  hidden: { clipPath: "inset(100% 0% 0% 0% round 14px)", y: 28 },
  visible: {
    clipPath: "inset(0% 0% 0% 0% round 14px)",
    y: 0,
    transition: {
      duration: duration.slow,
      ease,
      // NOT beforeChildren — the contents cascade in DURING the wipe (starting
      // almost immediately), so the card never sits as an empty shell waiting
      // for its text. The clip mask + the content fade resolve together.
      delayChildren: 0.08,
      staggerChildren: 0.05,
    },
  },
};
export const cardChild = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// lineMask — a display line that wipes up from behind a mask (the host element
// sets overflow:hidden). Pure transform, no opacity, so it reads as a clean
// reveal. Used for the hero-style name entrance; sequence lines via a stagger
// parent. Reduced motion collapses to a plain render (Reveal handles that).
export const lineMask = {
  hidden: { y: "115%" },
  visible: { y: 0, transition: { duration: duration.slower, ease } },
};

// breath — symmetric rise used when an element flows in AND out (once:false).
// Smaller travel + in-out ease so the exit reads as a calm release, not a drop.
export const breath = {
  hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.breath, ease: easeBreath },
  },
};

// Parent container that staggers its children’s reveal into a soft sequence.
export const stagger = (staggerChildren = 0.14, delayChildren = 0.05) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

// Default viewport for scroll reveals — fire once, as soon as any sliver is
// near the viewport. amount 0.01 (not 0.08: an IntersectionObserver threshold
// can be skipped entirely during a fast Lenis fling — observed live with the
// membership band scrolling past still clip-hidden) + a positive bottom margin
// that pre-triggers ~12% below the fold, so content is never gated behind a
// missed trigger.
export const viewportOnce = { once: true, amount: 0.01, margin: "0px 0px 12% 0px" };

// Breathe viewport — re-fires both ways so the element flows out as it leaves
// and re-forms as it returns. Generous symmetric margins keep the transition
// off-screen at the edges, so content is never mid-fade while you're reading it.
export const viewportBreathe = { once: false, amount: 0.25, margin: "-12% 0px -12% 0px" };
