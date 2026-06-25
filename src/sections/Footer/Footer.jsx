/* ============================================================================
   FOOTER — quiet, near-black. 4-column layout from the imported design.
   Domain = brand deck’s crowsongyogatherapy.com. Phone is a SAMPLE — replace.
   ========================================================================== */

import Logo from "../../components/Logo.jsx";
import styles from "./Footer.module.css";

const COLS = [
  {
    title: "pages",
    links: [
      { t: "about", href: "#about" },
      { t: "practice", href: "#practice" },
      { t: "courses", href: "#courses" },
      { t: "membership", href: "#membership" },
      { t: "contact", href: "#contact" },
    ],
  },
  {
    title: "sessions",
    links: [
      { t: "book now", href: "#book" },
      { t: "pricing", href: "#pricing" },
      { t: "what to expect", href: "#practice" },
      { t: "free consultation", href: "#contact" },
    ],
  },
  {
    title: "contact",
    links: [
      { t: "hello@crowsongyogatherapy.com", href: "mailto:hello@crowsongyogatherapy.com" },
      // PLACEHOLDER: phone — sample number, replace with real
      { t: "+1 604 555 0123", href: "tel:+16045550123" },
      { t: "instagram", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo variant="light" className={styles.logo} />
          <p className={styles.tagline}>
            ashtanga yoga therapy, one-on-one.
            <br />
            courses & membership online.
            <br />
            vancouver, bc · worldwide.
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title} className={styles.col}>
            <p className={styles.colTitle}>{col.title}</p>
            <ul className={styles.links}>
              {col.links.map((l) => (
                <li key={l.t}>
                  <a href={l.href} className={`${styles.link} cursor-target`}>
                    {l.t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={styles.bottom}>
          <p>© 2026 crow song yoga therapy · vancouver, bc</p>
          <p>crowsongyogatherapy.com</p>
        </div>
      </div>
    </footer>
  );
}
