/* ============================================================================
   INSIGHT — the reframe. Dark Crow, with a soft gradient floor that melts into
   the light section below (the page’s first exhale from dark to light).
   Big statement reveals line by line on scroll. Copy = client-approved comp.
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import styles from "./Insight.module.css";

export default function Insight() {
  return (
    <section className={styles.insight}>
      <Reveal stagger staggerGap={0.14} className={`container ${styles.inner}`}>
        <Reveal item variant="riseSmall" as="span" className={`eyebrow ${styles.kicker}`}>
          The practice
        </Reveal>

        <p className={styles.text}>
          <Reveal item as="span" className={styles.line}>
            Ashtanga’s Primary Series is literally called{" "}
            <strong>Yoga Chikitsa.</strong>
          </Reveal>
          <Reveal item as="span" className={styles.line}>
            Yoga therapy.
          </Reveal>
          <Reveal item as="span" className={styles.lineMuted}>
            The tradition was always about healing first.
          </Reveal>
        </p>
      </Reveal>
    </section>
  );
}
