/* ============================================================================
   ABOUT — the practitioner. Dark Crow. Portrait (placeholder) + bio, with the
   brand’s "on the name" line as a quiet quote. Copy = client-approved comp.

   The comp used a lavender left-border on the quote (a side-stripe — a banned
   pattern); replaced here with a short lavender rule above the quote.

   NOTE: swap the portrait placeholder for christine’s real photo; confirm any
   specific bio facts with her.
   ========================================================================== */

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Reveal from "../../components/Reveal.jsx";
import Divider from "../../components/Divider.jsx";
import Tilt from "../../components/Tilt.jsx";
import RatingBadge from "../../components/RatingBadge.jsx";
import styles from "./About.module.css";

/* PLACEHOLDER reviews — short, on-brand. Swap for christine's real testimonials.
   Cycle one at a time so the bio closes on living social proof, not a static line. */
const REVIEWS = [
  { stars: 5, quote: "she changed how i move.", name: "j.t. · long-term client" },
  { stars: 5, quote: "calm, precise, deeply kind.", name: "p.m. · anxiety & burnout" },
  { stars: 5, quote: "finally, yoga that fits my body.", name: "r.s. · post-surgery" },
  { stars: 5, quote: "a real teacher — rare.", name: "l.k. · mysore practice" },
];

/* Rotating star-reviews — one every 6s, cross-fading through a soft blur.
   a11y (WCAG 2.2.2): pauses on hover/focus, and does NOT auto-advance under
   reduced-motion (renders one review, static). No aria-live so it never spams
   screen readers; the rating is exposed to AT via sr-only text. */
function Reviews() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return; // honor reduced-motion + pause control
    const id = setInterval(() => setI((n) => (n + 1) % REVIEWS.length), 6000);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const r = REVIEWS[i];

  return (
    <div
      className={styles.reviewStage}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.figure
          key={i}
          className={styles.review}
          initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)", y: 8 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)", y: -8 }}
          transition={{ duration: reduce ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote className={styles.reviewQuote}>
            {r.quote}
            <span className="sr-only"> — {r.stars} out of 5 stars, {r.name}</span>
          </blockquote>
          <figcaption className={styles.reviewName}>{r.name}</figcaption>
        </motion.figure>
      </AnimatePresence>
    </div>
  );
}

export default function About() {
  return (
    <section id="lotus-bloom" className={`section ${styles.about}`}>
      {/* nav/footer "about" + "meet christine" links land on her bio here
          (the section keeps id="lotus-bloom" for the Lotus bloom trigger) */}
      <span id="about" className={styles.anchor} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        {/* lede — her name is the entrance (the most characteristic thing),
            wiping up line by line like the hero headline. */}
        <div className={styles.lede}>
          <Reveal stagger staggerGap={0.12} as="h2" className={styles.name} aria-label="christine white">
            <span className={styles.nameLine} aria-hidden="true">
              <Reveal item variant="lineMask" as="span" className={styles.nameInner}>christine</Reveal>
            </span>
            <span className={styles.nameLine} aria-hidden="true">
              <Reveal item variant="lineMask" as="span" className={styles.nameInner}>white</Reveal>
            </span>
          </Reveal>

          <Reveal stagger staggerGap={0.12} className={styles.leadCopy}>
            <Reveal item variant="riseSmall" as="p" className={styles.role}>
              Ashtanga Yoga Therapist&nbsp;·&nbsp;Vancouver
            </Reveal>
            <Reveal item variant="riseSmall">
              <Divider className={styles.rule} />
            </Reveal>
            <Reveal item as="p" className={styles.bio}>
              christine’s practice lives in the gap between what Ashtanga is
              perceived to be and what it was designed to do — working with people
              who’ve been told yoga isn’t for them, whose bodies are in transition,
              who need something more than a class.
            </Reveal>
          </Reveal>
        </div>

        {/* portrait — the tall lit anchor. PLACEHOLDER: a mystical lit field that
            turns with the cursor; drop christine's real photo in as an
            <img className={styles.photo}> inside .portrait when it lands. */}
        <Reveal variant="scaleIn" className={styles.media}>
          <Tilt className={styles.tilt}>
            <div className={styles.portrait}>
              <span className={styles.portraitGrain} aria-hidden="true" />
              <span className={styles.portraitLabel}>christine white — portrait</span>
            </div>
          </Tilt>
        </Reveal>

        {/* testimony — the section's closer: living social proof, one review
            cross-fading to the next. */}
        <Reveal variant="fade" className={styles.testimony}>
          {/* PLACEHOLDER copy — set a real aggregate title/count with christine
              (the demo's "2,000+ reviews" is not used; no fabricated numbers). */}
          <RatingBadge
            rating={5}
            title="five-star care"
            subtitle="in their words"
            className={styles.testimonyBadge}
          />
          <Reviews />
        </Reveal>
      </div>
    </section>
  );
}
