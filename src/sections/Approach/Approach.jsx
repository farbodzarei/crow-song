/* ============================================================================
   APPROACH ("What this is") — light Mist. Two columns: the positioning + a
   numbered list of pillars (a genuine 4-item list, so the numerals carry
   meaning rather than being section scaffolding). Copy = client-approved comp.
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import styles from "./Approach.module.css";

const PILLARS = [
  "private sessions tailored to your body",
  "grounded in the traditional ashtanga method",
  "adapted for injury, recovery and transition",
  "breath-centred and deeply therapeutic",
];

export default function Approach() {
  return (
    <section id="approach" className={`section section--light ${styles.approach}`}>
      <div className={`container cols ${styles.grid}`}>
        <Reveal stagger className={`col-6 ${styles.left}`}>
          <Reveal item as="h2" className={styles.heading}>
            one-on-one.
            <br />
            adapted.
            <br />
            for you.
          </Reveal>
          <Reveal item as="p" className={styles.body}>
            guided by christine white, an experienced ashtanga yoga therapist who
            works with the actual conditions of your body, not an idealised
            version of it. recovery, awareness, transition.
          </Reveal>
        </Reveal>

        <Reveal stagger staggerGap={0.12} as="ol" className={`col-6 ${styles.pillars}`}>
          {PILLARS.map((p, i) => (
            <Reveal item key={p} as="li" className={styles.pillar}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.pillarText}>{p}</span>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
