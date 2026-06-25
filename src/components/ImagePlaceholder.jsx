/* ============================================================================
   ImagePlaceholder — a tasteful, on-brand stand-in for real photography.
   Clearly a placeholder, trivially swappable for an <img>/<picture> later.
   Pass `ratio` (e.g. "4 / 5") and a short `label` describing the future image.
   ========================================================================== */

import styles from "./ImagePlaceholder.module.css";

export default function ImagePlaceholder({
  label = "image",
  ratio = "4 / 5",
  className = "",
}) {
  return (
    <div
      className={`${styles.ph} ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <span className={styles.frame} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
