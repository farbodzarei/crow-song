/* ============================================================================
   INTRO BAND — pull quote on haze. The "eight limbs" statement: what the word
   ashtanga actually means, and why that reframes the whole practice. (Replaced
   the earlier "lives in the gap" quote, which duplicated the About bio line;
   this is the page's second insight after yoga chikitsa.)
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import styles from "./IntroBand.module.css";

export default function IntroBand() {
  return (
    <section className={`section--lav ${styles.band}`}>
      <div className={`container cols ${styles.inner}`}>
        <Reveal variant="riseSmall" as="span" className={`col-4 ${styles.label}`}>
          the word
        </Reveal>
        <Reveal as="p" className={`col-8 ${styles.quote}`}>
          ashtanga is sanskrit for <em>eight limbs</em>.
          <br />
          posture is only one of them.
          <br />
          breath, attention, stillness —
          <br />
          the rest is where the healing lives.
        </Reveal>
      </div>
    </section>
  );
}
