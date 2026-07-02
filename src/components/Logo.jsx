/* ============================================================================
   Logo — the Crow Song wordmark (crow mark + "crow song"). Two color variants:
     • "light" — haze-toned, for use on DARK (crow) surfaces.
     • "dark"  — crow-toned, for use on LIGHT (haze) surfaces.
   Served from /public/logo (cropped to the artwork’s bounding box).
   ========================================================================== */

export default function Logo({ variant = "light", className = "" }) {
  return (
    <img
      src={`/logo/crow-song-${variant}.svg`}
      alt="Crow Song Yoga Therapy"
      className={className}
      width="231"
      height="49"
      decoding="async"
    />
  );
}
