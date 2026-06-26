/* ============================================================================
   Particles — faint lavender motes drifting slowly upward, like exhaled ujjayi
   breath. Canvas for performance; rAF paused when the tab is hidden.
   Disabled entirely under prefers-reduced-motion. Decorative only (aria-hidden).
   ========================================================================== */

import { useEffect, useRef } from "react";
import styles from "./Particles.module.css";

export default function Particles({ count = 34 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let motes = [];
    let raf = 0;
    let running = true;

    const rand = (a, b) => a + Math.random() * (b - a);

    const seed = () => {
      motes = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 2.2),
        vy: rand(0.06, 0.28), // slow rise
        sway: rand(0.2, 0.8),
        phase: rand(0, Math.PI * 2),
        a: rand(0.05, 0.35),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nw = rect.width;
      const nh = rect.height;
      if (nw === 0 || nh === 0) return; // not laid out yet — don't seed into nothing
      canvas.width = nw * dpr;
      canvas.height = nh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // seed once; on later resizes (scrollbar toggle, mobile URL bar, intro
      // lock) just rescale x so motes glide — never re-randomise / teleport.
      if (!motes.length) {
        w = nw;
        h = nh;
        seed();
        return;
      }
      const sx = w > 0 ? nw / w : 1;
      for (const m of motes) m.x *= sx;
      w = nw;
      h = nh;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy;
        m.phase += 0.005;
        const x = m.x + Math.sin(m.phase) * m.sway * 6;
        if (m.y < -4) {
          m.y = h + 4;
          m.x = rand(0, w);
        }
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155, 139, 184, ${m.a})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
