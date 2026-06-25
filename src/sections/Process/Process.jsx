/* ============================================================================
   PROCESS — "from here to there", 4 steps. Charcoal (crow-deep) bg.
   Copy verbatim from the imported design. Numerals carry order here (a real
   sequence), so they stay.
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import styles from "./Process.module.css";

const STEPS = [
  {
    title: "initial conversation",
    body: "a free 20-minute call. no commitment. we find out if this is the right fit before anything else happens.",
  },
  {
    title: "intake & assessment",
    body: "your first session is longer. we take time with your history, your body, and what brings you here before any movement begins.",
  },
  {
    title: "your practice",
    body: "sessions evolve as you do. there’s no fixed programme — it adapts to your changing needs, week by week.",
  },
  {
    title: "integration",
    body: "you leave with practices to carry into your life. the real work happens between sessions, in the quiet moments.",
  },
];

export default function Process() {
  return (
    <section className={`section section--darker ${styles.process}`}>
      <div className="container">
        <Reveal stagger className={styles.head}>
          <Reveal item variant="riseSmall" as="span" className={`eyebrow ${styles.kicker}`}>
            how it works
          </Reveal>
          <Reveal item as="h2" className={styles.title}>
            from here <em>to there</em>
          </Reveal>
        </Reveal>

        <Reveal stagger staggerGap={0.12} className={styles.grid}>
          {STEPS.map((s, i) => (
            <Reveal item key={s.title} className={styles.step}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepBody}>{s.body}</p>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
