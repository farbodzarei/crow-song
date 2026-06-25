/* ============================================================================
   Divider — the short lavender rule used throughout the brand (deck p01/p13).
   A single intentional moment of accent. Defaults to the lavender accent;
   pass tone="muted" on dark sections if a softer line is wanted.
   ========================================================================== */

import styles from "./Divider.module.css";

export default function Divider({ className = "", align = "start" }) {
  return (
    <span
      className={`${styles.rule} ${styles[align] || ""} ${className}`}
      aria-hidden="true"
    />
  );
}
