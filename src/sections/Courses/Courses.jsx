/* ============================================================================
   COURSES + MEMBERSHIP — lavender section. 3 course cards (one featured/dark)
   + the "crow song collective" membership band. Copy + pricing verbatim from
   the imported design.
   NOTE: confirm courses/membership actually exist + prices before launch.
   Enrol / join links are PLACEHOLDERS (#enrol / #membership).
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import Mandala from "../../components/Mandala.jsx";
import styles from "./Courses.module.css";

const COURSES = [
  {
    tag: "self-paced course",
    title: "intro to yoga therapy",
    price: "195",
    note: "one-time",
    features: ["6 video modules", "written guides + practices", "lifetime access", "beginner-friendly"],
    featured: false,
  },
  {
    tag: "most popular",
    title: "nervous system reset",
    price: "320",
    note: "4-week programme",
    features: ["4 weeks of guided practice", "2 live calls with christine", "daily audio practices", "private community access"],
    featured: true,
  },
  {
    tag: "foundations",
    title: "ashtanga fundamentals",
    price: "240",
    note: "one-time",
    features: ["breath, bandha, drishti", "8 module video series", "practice sequences PDF", "community forum access"],
    featured: false,
  },
];

const PERKS = [
  "2 live group sessions per month with christine",
  "full access to the practice library (60+ recordings)",
  "monthly q&a call — ask anything",
  "private community space",
  "early access to new courses",
  "10% off one-on-one sessions",
  "monthly moon practice — new & full",
];

export default function Courses() {
  return (
    <section id="courses" className={`section section--lav ${styles.sec}`}>
      <Mandala side="left" tone="onLight" />
      <div className="container">
        <Reveal stagger className={styles.intro}>
          <Reveal item variant="riseSmall" as="span" className={`eyebrow ${styles.kicker}`}>
            learn online
          </Reveal>
          <div className={styles.introRow}>
            <Reveal item as="h2" className={styles.title}>
              courses &<br />membership
            </Reveal>
            <Reveal item as="p" className={styles.introBody}>
              beyond the one-on-one. deepen your understanding of ashtanga, yoga
              therapy, and the body through structured online courses — or join
              the crow song collective for ongoing support, community, and a
              growing library of practices.
            </Reveal>
          </div>
        </Reveal>

        <Reveal stagger staggerGap={0.12} className={styles.grid}>
          {COURSES.map((c) => (
            <Reveal item key={c.title} as="article" className={`${styles.card} ${c.featured ? styles.featured : ""}`}>
              <span className={styles.tag}>{c.tag}</span>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.price}>
                <sup>$</sup>{c.price} <span>{c.note}</span>
              </p>
              <ul className={styles.features}>
                {c.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {/* PLACEHOLDER: enrolment link */}
              <a href="#enrol" className={`${c.featured ? styles.btnLight : styles.btnCrow} cursor-target`}>
                enrol now
              </a>
            </Reveal>
          ))}
        </Reveal>

        {/* membership band */}
        <Reveal id="membership" className={styles.band}>
          <div>
            <h3 className={styles.bandTitle}>
              the crow song<br /><em>collective</em>
            </h3>
            <p className={styles.bandBody}>
              a monthly membership for those who want to deepen their practice
              beyond the one-on-one. live sessions, a growing practice library,
              community, and direct access to christine.
            </p>
            <p className={styles.bandPrice}>
              <sup>$</sup>88
            </p>
            <p className={styles.bandNote}>per month · cancel any time</p>
            {/* PLACEHOLDER: membership join link */}
            <a href="#membership" className={`${styles.btnHaze} cursor-target`}>
              join the collective
            </a>
          </div>
          <ul className={styles.perks}>
            {PERKS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
