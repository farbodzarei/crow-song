/* ============================================================================
   Nav — fixed, transparent over the hero, blurred panel once scrolled.
   Desktop: mega-menu (About / Practice / Courses open 2-col dropdowns on hover
   or keyboard focus; Contact is a plain link). Mobile (<960px): a hamburger
   opens a full overlay with the section links + book. Links target in-page
   anchors (single-page site).
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease, duration } from "../tokens/motion.js";
import { BOOK_HREF, CONSULT_HREF } from "../content/links.js";
import Logo from "./Logo.jsx";
import styles from "./Nav.module.css";

const MENUS = [
  {
    label: "about",
    href: "#about",
    cols: [
      {
        label: "christine",
        links: [
          { t: "meet christine", s: "her story and approach", href: "#about" },
          { t: "values & philosophy", s: "what guides the work", href: "#about" },
          // keep credentials factual — no certification claims until confirmed
          { t: "training & background", s: "lineage, study, experience", href: "#about" },
        ],
      },
      {
        label: "the practice",
        links: [
          { t: "what is yoga therapy?", s: "how it differs from yoga", href: "#practice" },
          { t: "ashtanga tradition", s: "breath, gaze, movement", href: "#practice" },
          { t: "who it’s for", s: "pain, stress, embodiment", href: "#practice" },
        ],
      },
    ],
  },
  {
    label: "practice",
    href: "#practice",
    cols: [
      {
        label: "sessions",
        links: [
          { t: "what to expect", s: "a typical 75-min session", href: "#practice" },
          { t: "pricing", s: "single · monthly · series", href: "#pricing" },
          { t: "is it right for me?", s: "who comes and why", href: "#about" },
        ],
      },
      {
        label: "book",
        links: [
          { t: "free consultation", s: "20 min · no commitment", href: CONSULT_HREF },
          { t: "book a session", s: "single or package", href: BOOK_HREF },
          { t: "ask a question", s: "reach out directly", href: "#contact" },
        ],
      },
    ],
  },
  {
    label: "courses",
    href: "#courses",
    cols: [
      {
        label: "online",
        links: [
          { t: "intro to yoga therapy", s: "self-paced · 6 modules", href: "#courses" },
          { t: "ashtanga fundamentals", s: "tristhana — breath, bandha, drishti", href: "#courses" },
          { t: "nervous system reset", s: "4-week guided journey", href: "#courses" },
        ],
      },
      {
        label: "membership",
        links: [
          { t: "crow song collective", s: "monthly membership", href: "#membership" },
          { t: "what’s included", s: "live sessions, library, community", href: "#membership" },
          { t: "gift a membership", s: "for someone you love", href: "#contact" },
        ],
      },
    ],
  },
];

const MOBILE_LINKS = [
  { t: "about", href: "#about" },
  { t: "practice", href: "#practice" },
  { t: "courses", href: "#courses" },
  { t: "membership", href: "#membership" },
  { t: "pricing", href: "#pricing" },
  { t: "contact", href: "#contact" },
];

export default function Nav() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // while the mobile menu is open: lock scroll, Esc to close, move focus into
  // the overlay and trap Tab within it, then restore focus to the burger.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const items = () =>
      menuRef.current
        ? menuRef.current.querySelectorAll("a[href], button:not([disabled])")
        : [];
    items()[0]?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const list = items();
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      burgerRef.current?.focus();
    };
  }, [open]);

  const fadeIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: duration.slow, ease, delay: 0.2 },
      };

  return (
    <>
      <motion.header className={`${styles.nav} ${scrolled || open ? styles.scrolled : ""}`} {...fadeIn}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={`${styles.wordmark} cursor-target`} aria-label="Crow Song — home">
          <Logo variant="light" className={styles.logo} />
        </a>

        <nav aria-label="Primary" className={styles.primary}>
          <ul className={styles.links}>
            {MENUS.map((m) => (
              <li key={m.label} className={styles.item}>
                <a href={m.href} className={`${styles.link} cursor-target`}>
                  {m.label}
                </a>
                <div className={styles.mega} role="group" aria-label={m.label}>
                  {m.cols.map((col) => (
                    <div key={col.label} className={styles.megaCol}>
                      <p className={styles.megaColLabel}>{col.label}</p>
                      <ul className={styles.megaLinks}>
                        {col.links.map((l) => (
                          <li key={l.t} className={styles.megaItem}>
                            <a href={l.href} className={`${styles.megaLink} cursor-target`}>
                              {l.t}
                              <span className={styles.megaSub}>{l.s}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            ))}
            <li className={styles.item}>
              <a href="#contact" className={`${styles.link} cursor-target`}>
                contact
              </a>
            </li>
          </ul>
        </nav>

        {/* booking = mailto until a real scheduler exists (see content/links.js) */}
        <a href={BOOK_HREF} className={`${styles.book} cursor-target`}>
          book now
        </a>

        {/* mobile hamburger */}
        <button
          ref={burgerRef}
          className={`${styles.burger} cursor-target ${open ? styles.burgerOpen : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
      </motion.header>

      {/* mobile overlay — sibling of the header so its fixed positioning is
          relative to the viewport (the header’s backdrop-filter/transform would
          otherwise become its containing block and shrink it). */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className={styles.mobileMenu}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <ul className={styles.mobileList}>
              {MOBILE_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={`${styles.mobileLink} cursor-target`} onClick={() => setOpen(false)}>
                    {l.t}
                  </a>
                </li>
              ))}
            </ul>
            <a href={BOOK_HREF} className={`${styles.mobileBook} cursor-target`} onClick={() => setOpen(false)}>
              book now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
