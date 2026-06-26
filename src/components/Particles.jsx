/* ============================================================================
   Particles — faint lavender breath-motes drifting slowly upward across the
   WHOLE page (one fixed canvas overlay), like exhaled ujjayi breath. Density
   eases with scroll (denser through the dark "inhale" sections, sparse on the
   light ones). Cursor gently parts the motes around it. Canvas for perf; rAF
   paused when hidden. Disabled under prefers-reduced-motion. Decorative.
   ========================================================================== */

import { useEffect, useRef } from "react";
import styles from "./Particles.module.css";

export default function Particles({ count = 120 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let motes = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, on: false };
    const rand = (a, b) => a + Math.random() * (b - a);

    const seed = () => {
      motes = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        z: rand(0, 1), // depth → parallax speed, size, opacity (you scroll THROUGH them)
        r: rand(0.6, 2.4),
        vy: rand(0.04, 0.16), // a faint ambient rise on top of the scroll
        driftY: 0,
        sway: rand(0.2, 0.9),
        phase: rand(0, Math.PI * 2),
        a: rand(0.05, 0.26),
      }));
    };

    const resize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      if (!nw || !nh) return;
      canvas.width = nw * dpr;
      canvas.height = nh * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // seed once; later resizes just rescale x so motes never teleport
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

    // density eases by where you are: full through the dark sections, sparse on
    // the light ones (sampled from the section background under the viewport).
    let density = 1;
    let targetDensity = 1;
    let frame = 0;
    const sampleDensity = () => {
      const el = document.elementFromPoint(w / 2, h / 2);
      const sec = el && el.closest && el.closest("section, footer");
      if (!sec) return;
      const m = getComputedStyle(sec).backgroundColor.match(/\d+/g);
      if (!m || m.length < 3) return;
      const lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
      targetDensity = lum < 0.4 ? 1 : 0.32; // dark → full, light → sparse
    };

    const R = 130; // cursor influence radius
    const span = () => h + 120; // wrap field a bit taller than the viewport
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (frame++ % 16 === 0) sampleDensity();
      density += (targetDensity - density) * 0.06; // ease toward target
      const sc = window.scrollY || window.pageYOffset || 0;
      const S = span();
      for (const m of motes) {
        m.driftY += m.vy;
        m.phase += 0.005;
        // depth → how fast this mote moves with scroll (near = faster = parallax),
        // so the field has real depth and you travel THROUGH it as you scroll.
        const speed = 0.4 + m.z * 1.15;
        let y = (m.y - sc * speed - m.driftY) % S;
        if (y < 0) y += S;
        y -= 60; // recentre the wrap buffer
        let x = m.x + Math.sin(m.phase) * m.sway * 6;
        // cursor parts the motes — a gentle push away within R (visual, springs back)
        if (mouse.on) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / R) * (1 - d / R);
            x += (dx / d) * f * 26;
            y += (dy / d) * f * 26;
          }
        }
        const size = m.r * (0.45 + m.z * 1.05); // near motes larger
        const alpha = m.a * (0.4 + m.z * 0.6) * density; // near motes brighter
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155, 139, 184, ${alpha})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
