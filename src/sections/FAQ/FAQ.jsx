/* ============================================================================
   FAQ — accordion on haze. Copy verbatim from the imported design.
   Accessible: each question is a <button> with aria-expanded controlling its
   answer region. One open at a time. The answer opens with a smooth height
   reveal; a chevron rotates to signal state (clear, obvious affordance — no
   plus/cross morph). Reduced motion → instant crossfade, no height animation.
   ========================================================================== */

import { useState, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Reveal from "../../components/Reveal.jsx";
import styles from "./FAQ.module.css";

const ITEMS = [
  {
    q: "do I need to know yoga to start?",
    a: "not at all. yoga therapy meets you where you are. many clients come with no yoga background, and that’s often an advantage. we build from the ground up, for your body specifically.",
  },
  {
    q: "what’s the difference between yoga and yoga therapy?",
    a: "yoga classes are designed for groups and general wellbeing. yoga therapy is one-on-one and goal-oriented. sessions are shaped around you: your condition, your history, your goals. not a curriculum.",
  },
  {
    q: "where do sessions take place?",
    a: "in-person in east vancouver, bc, and online via video call. both formats are full and effective. many clients are surprised by how well online works.",
  },
  {
    q: "how are the online courses different from one-on-one sessions?",
    a: "courses are structured, self-paced learning experiences, great for deepening your understanding of yoga therapy concepts, building a home practice, and exploring the tradition. one-on-one sessions are deeply personal and therapeutic. many people do both.",
  },
  {
    q: "isn’t ashtanga too demanding for injuries?",
    a: "that reputation comes from group classes moving at the room’s pace. one-on-one, the sequence is a starting point, not a test — postures are adapted, shortened, or set aside entirely. flexibility and strength are results of practice, not requirements for it. the primary series was named yoga chikitsa — yoga therapy — for a reason.",
  },
  {
    q: "do i have to practice every day?",
    a: "no. the traditional rhythm is six mornings a week with rest on moon days — but that’s a destination, not an entry requirement. we build a practice your actual life can hold, and grow it from there.",
  },
  {
    q: "is there a sliding scale?",
    a: "yes. if pricing is a barrier, please reach out directly. access matters, and we’ll find something that works.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const base = useId();
  const reduce = useReducedMotion();

  return (
    <section className={`section section--lav ${styles.sec}`}>
      <div className="container">
        <Reveal stagger className="section-head">
          <Reveal item as="h2" className={`section-head__title ${styles.title}`}>
            things people ask
          </Reveal>
        </Reveal>

        <div className="cols">
          <Reveal stagger staggerGap={0.08} className={`col-8 ${styles.list}`}>
            {ITEMS.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${base}-panel-${i}`;
              const btnId = `${base}-btn-${i}`;
              return (
                <Reveal item key={item.q} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
                  <h3 className={styles.qWrap}>
                    <button
                      id={btnId}
                      className={`${styles.q} cursor-target`}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <span className={styles.qText}>{item.q}</span>
                      <span className={styles.chev} aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="16" height="16">
                          <path
                            d="M3.5 6 L8 10.5 L12.5 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className={styles.a}
                        initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{
                          duration: reduce ? 0.2 : 0.5,
                          ease: [0.16, 1, 0.3, 1],
                          opacity: { duration: reduce ? 0.2 : 0.32, ease: [0.16, 1, 0.3, 1] },
                        }}
                      >
                        <p className={styles.aBody}>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
