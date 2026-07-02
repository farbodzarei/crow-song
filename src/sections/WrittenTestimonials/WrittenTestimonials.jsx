/* ============================================================================
   WRITTEN TESTIMONIALS — 4 quote cards on crow. Copy verbatim from the
   imported design. (Replace with real, consented client quotes before launch.)
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import styles from "./WrittenTestimonials.module.css";

/* PLACEHOLDER: confirm these are real, consented client quotes */
const QUOTES = [
  { q: "I didn’t know yoga therapy existed until a friend mentioned it. now I can’t imagine my practice, or my life, without it.", c: "— J.T., long-term client" },
  { q: "christine holds space unlike anyone I’ve encountered. there’s a quality of attention she brings that I’ve genuinely never experienced elsewhere.", c: "— P.M., anxiety & burnout" },
  { q: "I came in post-surgery, nervous about movement. she was so careful, so precise. I left my first session crying — in the best possible way.", c: "— T.L., post-surgical recovery" },
  { q: "my nervous system has genuinely changed. I sleep differently. I respond differently. I don’t fully understand it. I just know it works.", c: "— K.A., chronic stress" },
];

export default function WrittenTestimonials() {
  return (
    <section className={`section section--dark ${styles.sec}`}>
      <div className="container">
        <Reveal stagger className="section-head">
          <Reveal item as="h2" className={`section-head__title ${styles.title}`}>
            more voices
          </Reveal>
        </Reveal>

        <Reveal stagger staggerGap={0.12} className="cols">
          {QUOTES.map((t) => (
            <Reveal item key={t.c} as="figure" className={`col-6 ${styles.card}`}>
              <blockquote className={styles.quote}>“{t.q}”</blockquote>
              <figcaption className={styles.cite}>{t.c}</figcaption>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
