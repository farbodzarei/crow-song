/* ============================================================================
   Cursor — custom lavender dot + trailing ring (the comp’s signature touch),
   built properly:
     • Fine-pointer devices only (mouse/trackpad). Touch keeps its native UX.
     • Disabled under prefers-reduced-motion (the lerp trail would fight it).
     • Hides the native cursor only while active; keyboard focus is untouched.
     • The ring eases toward the pointer; the dot tracks instantly.
     • Grows softly over interactive targets via transform:scale (no layout
       thrash — position + scale are both composited transforms).
   No external deps — a single rAF loop, cleaned up on unmount.

   Two effects on purpose: the first decides capability and flips `enabled`
   (which renders the dot/ring); the second runs ONLY once they exist, so the
   refs are valid when the rAF loop grabs them.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // 1) Decide whether the custom cursor should exist at all.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (fine.matches && !reduce.matches) setEnabled(true);
  }, []);

  // 2) Once the dot/ring are rendered, drive them.
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let ds = 1;
    let rs = 1;
    let dsT = 1;
    let rsT = 1;
    let raf = 0;

    // targets combine hover (over an interactive target) + press (mouse down),
    // so a click reads as a tactile pinch: ring contracts, dot swells.
    let hovering = false;
    let pressing = false;
    const applyTargets = () => {
      const ring = hovering ? 1.65 : 1;
      const dot = hovering ? 0.55 : 1;
      rsT = pressing ? ring * 0.72 : ring;
      dsT = pressing ? dot * 1.7 : dot;
    };
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onOver = (e) => {
      if (e.target.closest?.("a, button, .cursor-target")) {
        hovering = true;
        applyTargets();
      }
    };
    const onOut = (e) => {
      if (e.target.closest?.("a, button, .cursor-target")) {
        hovering = false;
        applyTargets();
      }
    };
    const onDown = () => {
      pressing = true;
      applyTargets();
    };
    const onUp = () => {
      pressing = false;
      applyTargets();
    };

    const tick = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ds += (dsT - ds) * 0.18;
      rs += (rsT - rs) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%) scale(${ds})`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${rs})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  );
}
