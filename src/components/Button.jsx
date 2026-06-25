/* ============================================================================
   Button — calls to action, strictly in palette (lavender / crow).
   Variants:
     • "wipe"  (default) — transparent, lavender hairline border, lavender wipe
                           fill on hover. Used on dark surfaces (hero).
     • "solid"           — solid crow fill, white text. Used on light/lavender
                           surfaces (CTA band).
   Renders <a> when `href` is given, else <button>. The label sits above the
   wipe via its own stacking context.

   NOTE: booking is a PLACEHOLDER — href defaults to "#book".
   ========================================================================== */

import styles from "./Button.module.css";

export default function Button({
  children,
  href,
  variant = "wipe",
  className = "",
  ...rest
}) {
  const cls = `${styles.btn} ${styles[variant]} ${className} cursor-target`;

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        <span className={styles.label}>{children}</span>
      </a>
    );
  }
  return (
    <button className={cls} {...rest}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
