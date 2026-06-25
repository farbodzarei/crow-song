/* ============================================================================
   SmoothScroll — Lenis momentum scrolling (the Awwwards "feel" signal).
   - Uses native scroll under the hood, so Motion’s useScroll + the nav’s
     scroll listener keep working unchanged.
   - Disabled under prefers-reduced-motion and on touch (native scroll there).
   - Intercepts in-page anchor links for an eased scrollTo (skips placeholders
     like #book that have no target).
   Renders nothing.
   ========================================================================== */

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09, // momentum — lower = smoother/heavier
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false, // keep native touch scrolling
    });

    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#" || id === "#book") return; // placeholders / no target
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.1 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
