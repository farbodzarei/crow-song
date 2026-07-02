/* ============================================================================
   CTA — closing invitation. Adopted from the imported design: centered on crow,
   with a faint crow motif behind. Copy verbatim. Booking is a PLACEHOLDER.
   (This replaces the earlier full-lavender CTA band — back in-palette/restraint.)
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import Magnetic from "../../components/Magnetic.jsx";
import styles from "./CTA.module.css";

export default function CTA() {
  return (
    <section id="contact" className={styles.cta}>
      {/* faint crow motif behind */}
      <svg className={styles.motif} width="600" height="400" viewBox="0 0 600 400" fill="none" aria-hidden="true">
        <polygon points="300,40 350,130 250,130" stroke="#9B8BB8" strokeWidth="2" fill="none" />
        <polygon points="300,130 420,230 300,340 180,230" stroke="#9B8BB8" strokeWidth="2" fill="none" />
        <polygon points="180,230 40,160 90,270" stroke="#9B8BB8" strokeWidth="2" fill="none" />
        <polygon points="420,230 560,160 510,270" stroke="#9B8BB8" strokeWidth="2" fill="none" />
        <line x1="300" y1="130" x2="300" y2="340" stroke="#9B8BB8" strokeWidth="1.5" />
        <line x1="180" y1="230" x2="420" y2="230" stroke="#9B8BB8" strokeWidth="1.5" />
      </svg>

      <div className={`container cols ${styles.grid}`}>
        <Reveal stagger className={styles.inner}>
        <Reveal item as="h2" className={styles.title}>
          ready to begin?<br />
          <em>from here.</em>
        </Reveal>
        <Reveal item variant="riseSmall" as="p" className={styles.sub}>
          a free 20-minute call. no commitment. just a beginning.
        </Reveal>
        <Reveal item className={styles.actions}>
          {/* PLACEHOLDER: booking method (#book) */}
          <Magnetic>
            <a href="#book" className={`${styles.btn} cursor-target`}>
              book a free consultation
            </a>
          </Magnetic>
        </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
