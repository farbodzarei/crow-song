/* ============================================================================
   RatingBadge — a compact star-rating badge (stars + title + subtitle).
   Same API as the requested component: <RatingBadge rating title subtitle />,
   rebuilt in this project's stack (CSS Modules, on-brand: lavender stars).
     • rating   — number of filled stars (out of `outOf`, default 5)
     • title    — headline line (e.g. "loved by clients")
     • subtitle — supporting line (e.g. a review count / context)
     • tone     — "onDark" (default) | "onLight" to sit on haze surfaces
   Accessible: the whole badge exposes a single aria-label; stars are decorative.
   ========================================================================== */

import styles from "./RatingBadge.module.css";

export default function RatingBadge({
  rating = 5,
  outOf = 5,
  title,
  subtitle,
  tone = "onDark",
  className = "",
}) {
  const filled = Math.round(rating);
  const label = `Rated ${rating} out of ${outOf}${title ? ` — ${title}` : ""}${subtitle ? `, ${subtitle}` : ""}`;

  return (
    <div className={`${styles.badge} ${styles[tone] || ""} ${className}`} role="img" aria-label={label}>
      <span className={styles.stars} aria-hidden="true">
        {Array.from({ length: outOf }, (_, i) => (
          <span key={i} className={i < filled ? styles.on : styles.off}>
            ★
          </span>
        ))}
      </span>
      {(title || subtitle) && (
        <span className={styles.text}>
          {title && <span className={styles.title}>{title}</span>}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </span>
      )}
    </div>
  );
}
