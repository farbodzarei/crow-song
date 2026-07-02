/* ============================================================================
   LINKS — the one place booking/contact actions are wired.

   Until christine provides a real scheduler (Calendly / Acuity / form), every
   "book" action is a mailto so no button on the live site is a dead link.
   Swap BOOK_HREF for the scheduler URL when it exists — nothing else changes.
   ========================================================================== */

export const EMAIL = "hello@crowsongyogatherapy.com";

export const BOOK_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "booking a session — crow song yoga therapy",
)}`;

export const CONSULT_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "free 20-minute consultation — crow song yoga therapy",
)}`;
