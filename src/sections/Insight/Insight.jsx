/* ============================================================================
   INSIGHT — a pinned, full-screen "exhale". The section sticks to the viewport
   while you scroll; the statement surfaces LETTER BY LETTER, then the world
   turns from Crow dark → Haze light (text flips to stay readable), and the pin
   releases into the rest of the page. The page's first dawn.

   Mechanics: a tall wrapper (height = pin distance) holds a sticky 100vh stage.
   scrollYProgress drives the per-letter reveal (0 → REVEAL_END), then the
   background/text colour crossfade (REVEAL_END → ~0.9), then it unpins.
   Reduced motion: a plain static section, full text shown, no pin. Copy =
   client-approved comp.
   ========================================================================== */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import styles from "./Insight.module.css";

// The statement, in styled segments. Split to characters below, preserving the
// emphasised word and the quieter closing line.
const SEGMENTS = [
  { text: "Ashtanga’s Primary Series is literally called " },
  { text: "Yoga Chikitsa.", strong: true },
  { text: " Yoga therapy. " },
  { text: "The tradition was always about healing first.", muted: true },
];

const REVEAL_END = 0.58; // letters finish revealing by 58% of the pinned scroll

// Flatten to characters, numbering only non-spaces (spaces reveal for free).
const CHARS = [];
let _k = 0;
SEGMENTS.forEach((seg, si) => {
  [...seg.text].forEach((ch, ci) => {
    const isSpace = ch === " ";
    CHARS.push({
      ch,
      isSpace,
      strong: !!seg.strong,
      muted: !!seg.muted,
      k: isSpace ? -1 : _k,
      key: `${si}-${ci}`,
    });
    if (!isSpace) _k++;
  });
});
const TOTAL = _k;

function Char({ data, progress, strongCol }) {
  const span = REVEAL_END / TOTAL;
  const start = data.k < 0 ? 0 : data.k * span;
  const end = Math.min(REVEAL_END, start + span * 6); // ~6 letters dissolve in at once
  const peak = data.muted ? 0.78 : 1; // the closing line stays a touch quieter
  const opacity = useTransform(progress, [start, end], [0, peak]);

  if (data.isSpace) return " ";
  return (
    <motion.span
      className={data.strong ? styles.strong : undefined}
      style={data.strong ? { opacity, color: strongCol } : { opacity }}
    >
      {data.ch}
    </motion.span>
  );
}

export default function Insight() {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  // Hold the read on dark, then turn the world over in a tight, late "dawn" so
  // the text never lingers in a low-contrast mid-grey. Text settles dark a hair
  // before the bg finishes lightening, keeping the final frame crisp.
  const MORPH = 0.74;
  const bg = useTransform(scrollYProgress, [MORPH, 0.9], ["#2E2633", "#E8E1EE"]);
  const baseCol = useTransform(scrollYProgress, [MORPH, 0.87], ["#F4F2F6", "#2E2633"]);
  const strongCol = useTransform(scrollYProgress, [MORPH, 0.87], ["#FFFFFF", "#2E2633"]);
  const kickerCol = useTransform(scrollYProgress, [MORPH, 0.9], ["#9B8BB8", "#7A6A9A"]);
  const kickerOp = useTransform(scrollYProgress, [0, 0.05, 0.88, 0.97], [0, 1, 1, 0]);
  // a lavender dawn that blooms as the colour turns, then eases off
  const bloomOp = useTransform(scrollYProgress, [MORPH - 0.04, 0.84, 1], [0, 0.85, 0.45]);
  const hintOp = useTransform(scrollYProgress, [0, 0.07], [1, 0]); // "scroll" cue fades on first move

  if (reduce) {
    return (
      <section className={styles.staticSection}>
        <div className={`container ${styles.inner}`}>
          <span className={`${styles.kicker} ${styles.kickerStatic}`}>The practice</span>
          <p className={`${styles.text} ${styles.textStatic}`}>
            Ashtanga’s Primary Series is literally called{" "}
            <strong className={styles.strong}>Yoga Chikitsa.</strong> Yoga therapy.{" "}
            <span className={styles.mutedStatic}>
              The tradition was always about healing first.
            </span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className={styles.wrap}>
      <motion.div className={styles.stage} style={{ backgroundColor: bg }}>
        <motion.div className={styles.bloom} style={{ opacity: bloomOp }} aria-hidden="true" />
        <div className={`container ${styles.inner}`}>
          <motion.span className={styles.kicker} style={{ color: kickerCol, opacity: kickerOp }}>
            The practice
          </motion.span>
          <motion.p className={styles.text} style={{ color: baseCol }}>
            {CHARS.map((d) => (
              <Char key={d.key} data={d} progress={scrollYProgress} strongCol={strongCol} />
            ))}
          </motion.p>
        </div>
        <motion.span className={styles.hint} style={{ opacity: hintOp }} aria-hidden="true">
          scroll
        </motion.span>
      </motion.div>
    </section>
  );
}
