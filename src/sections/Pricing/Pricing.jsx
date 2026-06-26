/* ============================================================================
   PRICING — one-on-one session tiers on crow. Featured tier is lavender.
   Copy + prices verbatim from the imported design. Booking is a PLACEHOLDER.
   NOTE: confirm session prices with christine before launch.
   ========================================================================== */

import Reveal from "../../components/Reveal.jsx";
import styles from "./Pricing.module.css";

const TIERS = [
  {
    label: "single session",
    title: "try the practice",
    price: "160",
    note: "/ 75 min",
    list: ["one-on-one with christine", "personalised to your needs", "take-home practices"],
    cta: "book →",
    featured: false,
  },
  {
    label: "recommended",
    title: "monthly practice",
    price: "540",
    note: "/ month",
    list: ["4 sessions per month", "between-session support", "evolving personal practice", "home practice recordings"],
    cta: "book now",
    featured: true,
  },
  {
    label: "deep dive",
    title: "intake + series",
    price: "920",
    note: "/ 6 sessions",
    list: ["extended intake session", "5 follow-up sessions", "full body-system assessment", "written practice plan"],
    cta: "book →",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className={`section section--dark ${styles.sec}`}>
      <div className="container">
        <Reveal stagger className={styles.head}>
          <Reveal item variant="riseSmall" as="span" className={`eyebrow ${styles.kicker}`}>
            one-on-one sessions
          </Reveal>
          <Reveal item as="h2" className={styles.title}>
            investment
          </Reveal>
        </Reveal>

        <Reveal stagger staggerGap={0.12} className={styles.grid}>
          {TIERS.map((t) => (
            <Reveal item key={t.title} as="article" className={`${styles.card} ${t.featured ? styles.featured : ""}`}>
              <span className={styles.label}>{t.label}</span>
              <h3 className={styles.cardTitle}>{t.title}</h3>
              <p className={styles.price}>
                <sup>$</sup>{t.price} <span>{t.note}</span>
              </p>
              <ul className={styles.list}>
                {t.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
              {/* PLACEHOLDER: booking method (#book) */}
              <a href="#book" className={`${t.featured ? styles.btnCrow : styles.btnGhost} cursor-target`}>
                {t.cta}
              </a>
            </Reveal>
          ))}
        </Reveal>

        <Reveal variant="riseSmall" as="p" className={styles.note}>
          sliding scale available.{" "}
          <a href="#contact" className={`${styles.noteLink} cursor-target`}>reach out</a>{" "}
          if pricing is a barrier.
        </Reveal>
      </div>
    </section>
  );
}
