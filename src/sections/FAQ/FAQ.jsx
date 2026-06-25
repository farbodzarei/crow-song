/* ============================================================================
   FAQ — accordion on lavender. Copy verbatim from the imported design.
   Accessible: each question is a <button> with aria-expanded controlling its
   answer region. One open at a time (matches the source behaviour).
   ========================================================================== */

import { useState, useId } from "react";
import Reveal from "../../components/Reveal.jsx";
import styles from "./FAQ.module.css";

const ITEMS = [
  {
    q: "do I need to know yoga to start?",
    a: "not at all. yoga therapy meets you where you are. many clients come with no yoga background — and that’s often an advantage. we build from the ground up, for your body specifically.",
  },
  {
    q: "what’s the difference between yoga and yoga therapy?",
    a: "yoga classes are designed for groups and general wellbeing. yoga therapy is one-on-one and goal-oriented. sessions are shaped around you — your condition, your history, your goals — not a curriculum.",
  },
  {
    q: "where do sessions take place?",
    a: "in-person in east vancouver, bc, and online via video call. both formats are full and effective. many clients are surprised by how well online works.",
  },
  {
    q: "how are the online courses different from one-on-one sessions?",
    a: "courses are structured, self-paced learning experiences — great for deepening your understanding of yoga therapy concepts, building a home practice, and exploring the tradition. one-on-one sessions are deeply personal and therapeutic. many people do both.",
  },
  {
    q: "is there a sliding scale?",
    a: "yes. if pricing is a barrier, please reach out directly. access matters, and we’ll find something that works.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const base = useId();

  return (
    <section className={`section section--lav ${styles.sec}`}>
      <div className="container">
        <Reveal stagger className={styles.head}>
          <Reveal item variant="riseSmall" as="span" className={`eyebrow ${styles.kicker}`}>
            questions
          </Reveal>
          <Reveal item as="h2" className={styles.title}>
            things people ask
          </Reveal>
        </Reveal>

        <Reveal stagger staggerGap={0.08} className={styles.list}>
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
                    <span>{item.q}</span>
                    <span className={styles.sign} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={styles.a}
                  hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </div>
              </Reveal>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
