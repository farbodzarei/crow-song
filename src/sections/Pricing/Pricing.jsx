/* ============================================================================
   PRICING — one-on-one session tiers on crow. Featured tier is lavender.
   Copy + prices verbatim from the imported design. Booking is a PLACEHOLDER.
   Cards enter as a choreography: each tile rises in, then its contents cascade
   (label → title → price → each line → CTA). Reduced motion → static.
   NOTE: confirm session prices with christine before launch.
   ========================================================================== */

import { motion, useReducedMotion } from "motion/react";
import Reveal from "../../components/Reveal.jsx";
import { cardShell, cardChild } from "../../tokens/motion.js";
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
  const reduce = useReducedMotion();
  // motion props applied only when motion is allowed; otherwise render static
  const shell = reduce ? {} : { variants: cardShell };
  const child = reduce ? {} : { variants: cardChild };

  return (
    <section id="pricing" className={`section section--dark ${styles.sec}`}>
      <div className="container">
        <Reveal stagger className="section-head">
          <Reveal item variant="riseSmall" as="span" className={`eyebrow ${styles.kicker}`}>
            one-on-one sessions
          </Reveal>
          <Reveal item as="h2" className={`section-head__title ${styles.title}`}>
            investment
          </Reveal>
        </Reveal>

        <Reveal stagger staggerGap={0.16} className={styles.grid}>
          {TIERS.map((t) => (
            <motion.article
              key={t.title}
              {...shell}
              className={`${styles.card} ${t.featured ? styles.featured : ""}`}
            >
              <span className={styles.sheen} aria-hidden="true" />
              <motion.span {...child} className={styles.label}>{t.label}</motion.span>
              <motion.h3 {...child} className={styles.cardTitle}>{t.title}</motion.h3>
              <motion.p {...child} className={styles.price}>
                <sup>$</sup>{t.price} <span>{t.note}</span>
              </motion.p>
              <motion.ul {...child} className={styles.list}>
                {t.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </motion.ul>
              {/* PLACEHOLDER: booking method (#book) */}
              <motion.a
                {...child}
                href="#book"
                className={`${t.featured ? styles.btnCrow : styles.btnGhost} cursor-target`}
              >
                {t.cta}
              </motion.a>
            </motion.article>
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
