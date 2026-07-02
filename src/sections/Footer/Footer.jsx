/* ============================================================================
   FOOTER — quiet, near-black. 4-column layout from the imported design.
   Domain = brand deck’s crowsongyogatherapy.com. Phone is a SAMPLE — replace.
   ========================================================================== */

import Logo from "../../components/Logo.jsx";
import { BOOK_HREF, CONSULT_HREF, EMAIL } from "../../content/links.js";
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
      { t: "book now", href: BOOK_HREF },
      { t: "pricing", href: "#pricing" },
      { t: "what to expect", href: "#practice" },
      { t: "free consultation", href: CONSULT_HREF },
    ],
  },
  {
    title: "contact",
    links: [
      { t: EMAIL, href: `mailto:${EMAIL}` },
      // phone + instagram intentionally absent until christine provides real
      // ones — a 555 number or an unowned handle costs more trust than a
      // shorter column. Add back here when confirmed.
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container cols ${styles.grid}`}>
        <div className={`col-3 ${styles.brand}`}>
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
