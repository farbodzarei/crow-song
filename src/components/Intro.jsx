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
import Logo from "./Logo.jsx";
import styles from "./Intro.module.css";

const SEEN_KEY = "cs-intro-seen";

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
            <Logo variant="light" className={styles.logo} />
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
