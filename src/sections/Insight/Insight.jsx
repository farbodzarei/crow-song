/* ============================================================================
   INSIGHT — the reframe. Dark Crow, with a soft gradient floor that melts into
   the light section below (the page’s first exhale from dark to light).
   Big statement reveals line by line on scroll. Copy = client-approved comp.
   ========================================================================== */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Reveal from "../../components/Reveal.jsx";
import styles from "./Insight.module.css";

export default function Insight() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["center end", "end center"] });
  // the dawn bloom brightens + rises as you scroll into the dark→light threshold
  const glowOpacity = useTransform(scrollYProgress, [0, 0.9], [0.25, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], [50, -12]);

  return (
    <section ref={ref} className={styles.insight}>
      {reduce ? (
        <div className={styles.bloom} aria-hidden="true" />
      ) : (
        <motion.div className={styles.bloom} style={{ opacity: glowOpacity, y: glowY }} aria-hidden="true" />
      )}
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
