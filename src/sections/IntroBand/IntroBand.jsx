/* ============================================================================
   INTRO BAND — pull quote on a full saturated-lavender field (adopted from the
   imported design). Copy verbatim from that design.
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import styles from "./IntroBand.module.css";

export default function IntroBand() {
  return (
    <section className={`section--lav ${styles.band}`}>
      <div className={`container cols ${styles.inner}`}>
        <Reveal variant="riseSmall" as="span" className={`col-4 ${styles.label}`}>
          the practice
        </Reveal>
        <Reveal as="p" className={`col-8 ${styles.quote}`}>
          christine’s practice lives in the gap:
          <br />
          between <em>yoga and therapy</em>,
          <br />
          movement and stillness,
          <br />
          the body and what it carries.
        </Reveal>
      </div>
    </section>
  );
}
