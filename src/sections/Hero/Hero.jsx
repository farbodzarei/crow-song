/* ============================================================================
   HERO — the client-approved composition, rebuilt properly.
   Dark Crow field, headline bottom-left, brand crow drawing itself in the
   negative space top-right, breath particles, ambient glow, grain. Entrance
   choreography matches the comp’s cadence (headline → aside → scroll hint),
   driven by Motion and reduced-motion safe.

   Copy (client-approved, from the comp):
     headline  "Find your breath, / find your balance."  (2nd line lavender)
     aside     "Therapeutic Ashtanga for bodies in transition. One-on-one. Adapted to you."
     action    "Book a session"  → booking is a PLACEHOLDER (#book)
   ========================================================================== */

import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../tokens/motion.js";
import Crow from "../../components/Crow.jsx";
import Button from "../../components/Button.jsx";
import Magnetic from "../../components/Magnetic.jsx";
import styles from "./Hero.module.css";

export default function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, ease, delay },
        };
  // headline lines wipe up from behind a mask
  const line = (delay) =>
    reduce
      ? {}
      : {
          initial: { y: "115%" },
          animate: { y: 0 },
          transition: { duration: 1.3, ease, delay },
        };

  return (
    <section id="top" className={`section--dark ${styles.hero}`}>
      <div className={styles.glow} aria-hidden="true" />
      <Crow className={styles.crow} />

      {/* top frame — on the shared container so label/url align to the gutters */}
      <div className={styles.topFrame}>
        <div className="container">
          <div className={styles.rule} aria-hidden="true" />
          <div className={styles.topRow}>
            <span className={styles.label}>Yoga Therapy</span>
            <span className={styles.url}>crowsongyogatherapy.com</span>
          </div>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        <h1 className={styles.headline}>
          <span className={styles.line}>
            <motion.span className={styles.lineInner} {...line(0.2)}>
              Find your breath,
            </motion.span>
          </span>
          <span className={styles.line}>
            <motion.span className={styles.lineInner} {...line(0.34)}>
              <em>find your balance.</em>
            </motion.span>
          </span>
        </h1>

        <motion.div className={styles.aside} {...rise(0.45)}>
          <p className={styles.sub}>
            Therapeutic Ashtanga for bodies in transition. One-on-one. Adapted to
            you.
          </p>
          {/* PLACEHOLDER: booking method (mailto / Calendly / form) — wired to #book */}
          <Magnetic>
            <Button href="#book" variant="wipe">
              Book a session
            </Button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollHint}
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 1.2, ease, delay: 0.9 },
            })}
        aria-hidden="true"
      >
        <span className={styles.scrollLine} />
        <span className={styles.scrollWord}>Scroll</span>
      </motion.div>
    </section>
  );
}
