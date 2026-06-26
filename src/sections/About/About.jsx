/* ============================================================================
   ABOUT — the practitioner. Dark Crow. Portrait (placeholder) + bio, with the
   brand’s "on the name" line as a quiet quote. Copy = client-approved comp.

   The comp used a lavender left-border on the quote (a side-stripe — a banned
   pattern); replaced here with a short lavender rule above the quote.

   NOTE: swap the portrait placeholder for christine’s real photo; confirm any
   specific bio facts with her.
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import Divider from "../../components/Divider.jsx";
import ImagePlaceholder from "../../components/ImagePlaceholder.jsx";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="lotus-bloom" className={`section ${styles.about}`}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        {/* PLACEHOLDER: christine portrait — swap for a real photo */}
        <Reveal className={styles.media}>
          <ImagePlaceholder label="christine white — portrait" ratio="4 / 5" />
        </Reveal>

        <Reveal stagger className={styles.text}>
          <Reveal item variant="riseSmall" as="span" className={`eyebrow ${styles.kicker}`}>
            The practitioner
          </Reveal>
          <Reveal item as="h2" className={styles.name}>
            christine
            <br />
            white
          </Reveal>
          <Reveal item as="p" className={styles.title}>
            Ashtanga Yoga Therapist
          </Reveal>
          <Reveal item as="p" className={styles.body}>
            christine’s practice lives in the gap between what Ashtanga is
            perceived to be and what it was designed to do. She works with people
            who have been told yoga isn’t for them, whose bodies are in
            transition, who need something more than a class.
          </Reveal>

          <Reveal item className={styles.quoteWrap}>
            <Divider className={styles.quoteRule} />
            <blockquote className={styles.quote}>
              The crow moves <em>between worlds.</em>
            </blockquote>
            <p className={styles.gloss}>
              Transformation. Intuition. Sacred messenger.
            </p>
            <cite className={styles.quoteCite}>On the name</cite>
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
