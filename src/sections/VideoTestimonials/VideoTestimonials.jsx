/* ============================================================================
   VIDEO TESTIMONIALS — 3 cards + a play modal. Lavender bg. Copy verbatim from
   the imported design. Videos are PLACEHOLDERS (drop real embeds later).
   Modal is accessible: role=dialog, Esc to close, backdrop click, focus moves
   to the close button, restores on close.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Reveal from "../../components/Reveal.jsx";
import Mandala from "../../components/Mandala.jsx";
import styles from "./VideoTestimonials.module.css";

/* PLACEHOLDER: replace with real video embeds + consented client quotes */
const VIDEOS = [
  {
    name: "M.L.",
    context: "chronic pain client",
    quote:
      "working with christine changed how I live in my body — not just how I move, but how I breathe, sleep, respond.",
  },
  {
    name: "R.K.",
    context: "stress & anxiety",
    quote:
      "I came in skeptical. I’d tried yoga before — studios, apps, all of it. this was different. it felt like finally being seen.",
  },
  {
    name: "S.A.",
    context: "injury recovery",
    quote:
      "the pacing is so different from any yoga class. unhurried. attentive. I leave genuinely restored every time.",
  },
];

function PlayIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
      <polygon points="2,1 17,10 2,19" fill="#2E2633" />
    </svg>
  );
}

export default function VideoTestimonials() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null); // index or null
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (active === null) return;
    lastFocused.current = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lastFocused.current?.focus?.();
    };
  }, [active]);

  const v = active !== null ? VIDEOS[active] : null;

  return (
    <section className={`section section--lav ${styles.sec}`}>
      <Mandala side="right" tone="onLight" />
      <div className="container">
        <Reveal stagger className={styles.head}>
          <Reveal item variant="riseSmall" as="span" className={`eyebrow ${styles.kicker}`}>
            what people say
          </Reveal>
          <Reveal item as="h2" className={styles.title}>
            in their own words
          </Reveal>
        </Reveal>

        <Reveal stagger staggerGap={0.12} className={styles.grid}>
          {VIDEOS.map((card, i) => (
            <Reveal item key={card.name} as="article" className={styles.card}>
              <button
                className={`${styles.video} cursor-target`}
                onClick={() => setActive(i)}
                aria-label={`Play video testimonial — ${card.name}, ${card.context}`}
              >
                <span className={styles.media} aria-hidden="true" />
                <span className={styles.play} aria-hidden="true">
                  <PlayIcon />
                </span>
                <span className={styles.overlay}>
                  <span className={styles.quote}>“{card.quote}”</span>
                  <span className={styles.name}>
                    — {card.name}, {card.context}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </Reveal>
      </div>

      <AnimatePresence>
        {v && (
          <motion.div
            className={styles.modal}
            onClick={(e) => e.target === e.currentTarget && setActive(null)}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Video testimonial — ${v.name}`}
          >
            <div className={styles.modalInner}>
              <button
                ref={closeRef}
                className={`${styles.modalClose} cursor-target`}
                onClick={() => setActive(null)}
                aria-label="Close"
              >
                ×
              </button>
              <div className={styles.player}>
                <div className={styles.playerPlaceholder}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className={styles.playerIcon}>
                    <circle cx="24" cy="24" r="23" stroke="#9B8BB8" strokeWidth="0.75" />
                    <polygon points="18,14 36,24 18,34" fill="#9B8BB8" opacity="0.6" />
                  </svg>
                  <strong className={styles.playerName}>
                    {v.name} · {v.context}
                  </strong>
                  <span className={styles.playerQuote}>“{v.quote}”</span>
                  {/* PLACEHOLDER: replace with the real video embed */}
                  <span className={styles.playerHint}>
                    replace this placeholder with the video embed
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
