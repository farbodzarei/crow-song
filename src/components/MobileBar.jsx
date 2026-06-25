/* ============================================================================
   MobileBar — docked primary action for the mobile/standalone experience.
   Appears once you've scrolled past the hero; tucks away when the closing CTA
   (#contact) is on screen so it never fights the page's own book button.
   Slides with a spring; reduced motion just fades it in/out.
   ========================================================================== */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import styles from "./MobileBar.module.css";

export default function MobileBar() {
  const reduce = useReducedMotion();
  const [past, setPast] = useState(false); // scrolled past the hero
  const [atEnd, setAtEnd] = useState(false); // closing CTA in view

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // tuck away once the closing CTA *or* the footer is on screen — either one
    // already offers the book action, and the bar shouldn't cover the footer.
    const targets = [
      document.getElementById("contact"),
      document.querySelector("footer"),
    ].filter(Boolean);
    if (!targets.length) return;
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setAtEnd(visible.size > 0);
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const show = past && !atEnd;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.bar}
          role="region"
          aria-label="Quick actions"
          initial={reduce ? { opacity: 0 } : { y: "120%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "120%" }}
          transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 34 }}
        >
          {/* PLACEHOLDER: booking method (#book) + free-call (#contact) */}
          <a href="#contact" className={`${styles.action} ${styles.ghost} cursor-target`}>
            free call
          </a>
          <a href="#book" className={`${styles.action} ${styles.primary} cursor-target`}>
            book a session
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
