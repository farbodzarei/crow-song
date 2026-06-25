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
    tag: "One-on-one",
    title: "Private yoga therapy",
    desc: "One-on-one Ashtanga sessions adapted to your body’s current needs and capacity.",
  },
  {
    tag: "Recovery",
    title: "Injury and recovery",
    desc: "Therapeutic movement for those navigating chronic pain, post-surgery recovery, or long-term injury.",
  },
  {
    tag: "Awareness",
    title: "Awareness practice",
    desc: "For those seeking to deepen their relationship with their body through breath and mindful movement.",
  },
];

export default function Practice() {
  return (
    <section id="practice" className={`section section--light-lav ${styles.practice}`}>
      <div className="container">
        <Reveal stagger className={styles.header}>
          <Reveal item as="h2" className={styles.heading}>
            Therapeutic Ashtanga for bodies in transition.
          </Reveal>
          <Reveal item variant="riseSmall" as="p" className={styles.lead}>
            Every session is built around where you are — not where the practice
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
