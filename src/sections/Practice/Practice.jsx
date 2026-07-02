/* ============================================================================
   PRACTICE — light Haze (lavender-tinted). Three service cards. Copy =
   client-approved comp; the decorative "01 — Session" numerals are dropped
   (three services aren’t an ordered sequence — that’s the AI-grammar tell).
   A small lavender category word labels each instead.

   NOTE: confirm service names / scope / pricing with christine.
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import styles from "./Practice.module.css";

const CARDS = [
  {
    tag: "one-on-one",
    title: "private yoga therapy",
    desc: "sessions built from the primary series — yoga chikitsa — and adapted to your body’s current needs and capacity.",
  },
  {
    tag: "recovery",
    title: "injury and recovery",
    desc: "therapeutic movement for those navigating chronic pain, post-surgery recovery, or long-term injury.",
  },
  {
    tag: "awareness",
    title: "awareness practice",
    desc: "for those seeking a deeper relationship with their body — breath with sound, a steady gaze, unhurried movement.",
  },
];

export default function Practice() {
  return (
    <section id="practice" className={`section section--light-lav ${styles.practice}`}>
      <div className="container">
        <Reveal stagger className="section-head">
          <Reveal item as="h2" className={`section-head__title ${styles.heading}`}>
            three ways in.
          </Reveal>
          <Reveal item variant="riseSmall" as="p" className={`section-head__lead ${styles.lead}`}>
            every session is built around where you are, not where the practice
            says you should be.
          </Reveal>
        </Reveal>

        <Reveal stagger staggerGap={0.14} className={styles.cards}>
          {CARDS.map((c) => (
            <Reveal item key={c.title} as="article" className={`${styles.card} cursor-target`}>
              <span className={styles.tag}>{c.tag}</span>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.desc}</p>
              <span className={styles.arrow} aria-hidden="true">&#8594;</span>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
