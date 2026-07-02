/* ============================================================================
   Intro — the first-load signature. Opens on the brand’s own cover: a Crow
   field, a short lavender rule, the wordmark revealing, "yoga therapy"
   settling — a held breath — then the curtain lifts into the page.

   One orchestrated moment (frontend-design: spend boldness in one place).
   - Plays once per session (sessionStorage), skippable (click / any key).
   - Reduced motion or already-seen → renders nothing, no flash.
   ========================================================================== */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ease } from "../tokens/motion.js";
import styles from "./Intro.module.css";

const SEEN_KEY = "cs-intro-seen";

// signal the hero crow that the loading curtain is gone, so its draw-in plays
// where it can be seen (a flag covers the race; the event covers live finish).
export function signalIntroDone() {
  if (typeof window === "undefined") return;
  window.__csIntroDone = true;
  window.dispatchEvent(new Event("cs-intro-done"));
}

export default function Intro({ onDone }) {
  // decide synchronously so reduced-motion / repeat visits never flash
  const [active] = useState(() => {
    if (typeof window === "undefined") return false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !reduce && !sessionStorage.getItem(SEEN_KEY);
  });
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(!active);

  useEffect(() => {
    if (!active) {
      signalIntroDone(); // no curtain → let the hero crow start immediately
      onDone?.();
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setExiting(true), 2500);
    const onKey = () => setExiting(true);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onDone]);

  const finish = () => {
    sessionStorage.setItem(SEEN_KEY, "1");
    document.body.style.overflow = "";
    setGone(true);
    signalIntroDone(); // curtain lifted → hero crow draws in now
    onDone?.();
  };

  if (gone) return null;

  return (
    <motion.div
      className={styles.curtain}
      role="presentation"
      onClick={() => setExiting(true)}
      initial={{ y: 0 }}
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1.15, ease }}
      onAnimationComplete={() => exiting && finish()}
    >
      <motion.div
        className={styles.inner}
        animate={exiting ? { opacity: 0, y: -18 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease }}
      >
        <motion.span
          className={styles.rule}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.25 }}
        />
        <span className={styles.logoMask}>
          <motion.span
            className={styles.logoInner}
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.5 }}
          >
            {/* first-version mark (crow + "crow song", no baked-in tagline)
                — the curtain reveals "yoga therapy" as its own line below */}
            <img
              src="/logo/crow-song-intro.svg"
              alt="Crow Song Yoga Therapy"
              className={styles.logo}
              width="234"
              height="45"
              decoding="async"
            />
          </motion.span>
        </span>
        <motion.span
          className={styles.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease, delay: 1.1 }}
        >
          yoga therapy
        </motion.span>
      </motion.div>

      <motion.button
        className={`${styles.skip} cursor-target`}
        onClick={() => setExiting(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        skip
      </motion.button>
    </motion.div>
  );
}
