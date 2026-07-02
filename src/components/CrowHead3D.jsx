/* ============================================================================
   CrowHead3D — a realistic crow head built from low-poly geometry, watching
   the cursor. Unlike CrowHead (flat facets on CSS depth planes), this is a
   true 3D mesh: a lofted crow-head form — rounded skull, full cheeks, sloped
   forehead flowing into a long stout corvid beak — defined as 3D vertices,
   rotated toward the pointer (yaw/pitch), perspective-projected and painter-
   sorted onto a <canvas> each frame, each facet lit against a fixed lavender
   light. No WebGL, no deps.

   • Head: genuinely turns in 3D — yaw the cursor sideways and the beak sweeps
     across in perspective, the far cheek forecloses, the near eye comes round.
   • Eyes: side-set discs on the skull; pupils track the pointer independently
     and lead the head. Eyes occlude naturally (the far eye turns away).
   • Idle: wanders through a slow look-around and blinks when the pointer
     rests. Aura + irises brighten as the cursor approaches.
   • Reduced motion: a single static, forward-facing render.
   ========================================================================== */

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import styles from "./CrowHead3D.module.css";
import { MESH } from "./crowHeadMesh.js";

// palette — kept in step with components/Crow.jsx / CrowHead.jsx
const LV = "235,224,255"; // #ebe0ff  bright lavender
const SF = "196,184,214"; // #c4b8d6  soft lavender
const AC = "155,139,184"; // #9B8BB8  accent lavender

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const LIGHT = (() => {
  const l = [-0.42, 0.58, 0.72];
  const m = Math.hypot(...l);
  return l.map((v) => v / m);
})();
const CAM = 5; // camera distance in mesh units (perspective strength)

export default function CrowHead3D({ className = "" }) {
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  // normalized pointer position relative to the viewport, each −1..1
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // head turn — springy so it settles rather than snaps (radians)
  const headSpring = { stiffness: 100, damping: 18, mass: 0.8 };
  const yaw = useSpring(useTransform(px, [-1, 1], [-0.66, 0.66]), headSpring);
  const pitch = useSpring(useTransform(py, [-1, 1], [-0.4, 0.4]), headSpring);
  const shiftX = useSpring(useTransform(px, [-1, 1], [-9, 9]), headSpring);
  const shiftY = useSpring(useTransform(py, [-1, 1], [-6, 6]), headSpring);

  // pupils lead the head and settle faster → the eyes look first
  const pupilSpring = { stiffness: 240, damping: 22, mass: 0.5 };
  const pupilX = useSpring(px, pupilSpring);
  const pupilY = useSpring(py, pupilSpring);

  // aura + irises brighten as the pointer nears the head
  const near = useMotionValue(0);
  const glow = useSpring(near, { stiffness: 80, damping: 20 });
  const auraOpacity = useTransform(glow, [0, 1], [0.5, 1]);
  const auraScale = useTransform(glow, [0, 1], [0.96, 1.06]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0;
    let lid = 0; // eyelid 0 open → 1 shut (read by drawEye each frame)

    const resize = () => {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) drawScene(0); // keep the static render crisp on resize
    };

    // ── one frame: rotate → light → sort → paint ─────────────────────────────
    const drawScene = (t) => {
      const { verts, tris, eyes } = MESH;
      const b = yaw.get();
      const a = pitch.get();
      const sb = Math.sin(b), cb = Math.cos(b);
      const sa = Math.sin(a), ca = Math.cos(a);
      // slow breath — a gentle swell + bob on the whole head
      const ph = reduce ? 0 : ((t % 7000) / 7000) * Math.PI * 2;
      const S = Math.min(w, h) * 0.35 * (1 + 0.012 * Math.sin(ph));
      const cx = w / 2 + shiftX.get();
      const cy = h / 2 + shiftY.get() + 3 * Math.sin(ph);

      const rot = (p) => {
        const x1 = p[0] * cb + p[2] * sb;
        const z1 = -p[0] * sb + p[2] * cb;
        const y2 = p[1] * ca - z1 * sa;
        const z2 = p[1] * sa + z1 * ca;
        return [x1, y2, z2];
      };
      const rv = verts.map(rot);
      const pv = rv.map((p) => {
        const k = CAM / (CAM - p[2]);
        return [cx + p[0] * S * k, cy - p[1] * S * k];
      });

      ctx.clearRect(0, 0, w, h);
      ctx.lineJoin = "round";
      ctx.lineWidth = 0.7;

      const g = glow.get();
      const list = [];
      for (let i = 0; i < tris.length; i++) {
        const [ia, ib, ic, beak] = tris[i];
        const A = rv[ia], B = rv[ib], C = rv[ic];
        const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2];
        const vx = C[0] - A[0], vy = C[1] - A[1], vz = C[2] - A[2];
        let nx = uy * vz - uz * vy;
        let ny = uz * vx - ux * vz;
        let nz = ux * vy - uy * vx;
        const nl = Math.hypot(nx, ny, nz) || 1;
        nx /= nl; ny /= nl; nz /= nl;
        if (nz <= 0.01) continue; // backface
        const lum = Math.max(0, nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
        const rim = (1 - nz) * 0.15;
        // solid enough that near facets visually occlude far ones (a crow is a
        // solid black bird) — the beak densest, so it reads as a cone head-on
        list.push({
          z: (A[2] + B[2] + C[2]) / 3,
          tri: i,
          fill: beak
            ? `rgba(${AC},${0.28 + 0.42 * lum})`
            : `rgba(${SF},${0.1 + 0.26 * lum})`,
          stroke: `rgba(${LV},${clamp(0.1 + 0.26 * lum + rim, 0, 0.55)})`,
        });
      }
      for (let e = 0; e < eyes.length; e++) {
        const eye = eyes[e];
        const rc = rot(eye.c);
        const rn = rot(eye.n);
        // the far eye turns away and hides well before the silhouette edge
        if (rn[2] > 0.35) list.push({ z: rc[2] + 0.12, eye, rc, rn, g });
      }
      list.sort((p, q) => p.z - q.z);

      for (const it of list) {
        if (it.eye) {
          drawEye(ctx, it, S, cx, cy);
          continue;
        }
        const [ia, ib, ic] = tris[it.tri];
        ctx.beginPath();
        ctx.moveTo(pv[ia][0], pv[ia][1]);
        ctx.lineTo(pv[ib][0], pv[ib][1]);
        ctx.lineTo(pv[ic][0], pv[ic][1]);
        ctx.closePath();
        ctx.fillStyle = it.fill;
        ctx.strokeStyle = it.stroke;
        ctx.fill();
        ctx.stroke();
      }
    };

    // one eye: luminous iris disc + tracking pupil + catch-light + blink lid
    const drawEye = (ctx2, it, S, cx, cy) => {
      const k = CAM / (CAM - it.rc[2]);
      const ex = cx + it.rc[0] * S * k;
      const ey = cy - it.rc[1] * S * k;
      const r = it.eye.r * S * k;
      const vis = clamp((it.rn[2] - 0.35) / 0.3, 0, 1);
      ctx2.save();
      ctx2.globalAlpha = vis;
      const grad = ctx2.createRadialGradient(ex - r * 0.25, ey - r * 0.25, r * 0.1, ex, ey, r);
      grad.addColorStop(0, `rgba(${LV},${0.85 + 0.15 * it.g})`);
      grad.addColorStop(0.55, `rgba(${AC},${0.7 + 0.2 * it.g})`);
      grad.addColorStop(1, `rgba(${AC},0.12)`);
      ctx2.beginPath();
      ctx2.arc(ex, ey, r, 0, Math.PI * 2);
      ctx2.fillStyle = grad;
      ctx2.fill();
      ctx2.strokeStyle = `rgba(${SF},0.4)`;
      ctx2.stroke();
      // pupil — tracks the pointer, clamped inside the iris
      const ox = clamp(pupilX.get(), -1, 1) * r * 0.42;
      const oy = clamp(pupilY.get(), -1, 1) * r * 0.42;
      ctx2.beginPath();
      ctx2.arc(ex + ox, ey + oy, r * 0.42, 0, Math.PI * 2);
      ctx2.fillStyle = "#241d29";
      ctx2.fill();
      ctx2.strokeStyle = `rgba(${LV},0.5)`;
      ctx2.stroke();
      ctx2.beginPath();
      ctx2.arc(ex + ox - r * 0.16, ey + oy - r * 0.17, r * 0.1, 0, Math.PI * 2);
      ctx2.fillStyle = `rgba(${LV},0.95)`;
      ctx2.fill();
      // eyelid — closes from the top on blink
      if (lid > 0.01) {
        ctx2.beginPath();
        ctx2.arc(ex, ey, r + 0.75, 0, Math.PI * 2);
        ctx2.clip();
        ctx2.fillStyle = "rgba(52,43,58,0.96)";
        ctx2.fillRect(ex - r - 1, ey - r - 1, (r + 1) * 2, lid * (r + 1) * 2);
      }
      ctx2.restore();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    if (reduce) {
      // static, forward-facing render; no listeners, no loop
      drawScene(0);
      return () => ro.disconnect();
    }

    // ── pointer tracking + idle look-around + blinking ───────────────────────
    let lastMove = -1e4;
    let blinkStart = -1e4;
    let nextBlink = 1600;

    const onMove = (e) => {
      lastMove = performance.now();
      const vcx = window.innerWidth / 2;
      const vcy = window.innerHeight * 0.46;
      px.set(clamp((e.clientX - vcx) / (window.innerWidth * 0.5), -1, 1));
      py.set(clamp((e.clientY - vcy) / (window.innerHeight * 0.5), -1, 1));
      const r = stage.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      near.set(clamp(1 - Math.hypot(dx, dy) / (r.width || 1), 0, 1));
    };

    let raf = 0;
    const tick = (t) => {
      // idle: wander through a slow figure-eight when the pointer rests
      if (t - lastMove > 2600) {
        const s = t / 1000;
        px.set(0.45 * Math.sin(s * 0.55));
        py.set(0.26 * Math.sin(s * 0.9 + 1.2));
        near.set(0.15);
      }
      // blink: quick shut/open sweep, occasionally double
      if (t > nextBlink) {
        blinkStart = t;
        nextBlink = t + 2400 + Math.random() * 4200 + (Math.random() < 0.3 ? 340 : 0);
      }
      const bp = (t - blinkStart) / 280;
      lid = bp >= 0 && bp < 1 ? Math.sin(Math.PI * bp) : 0;
      drawScene(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduce, px, py, near, yaw, pitch, shiftX, shiftY, pupilX, pupilY, glow]);

  return (
    <div ref={stageRef} className={`${styles.stage} ${className}`} aria-hidden="true">
      <motion.div
        className={styles.aura}
        style={reduce ? undefined : { opacity: auraOpacity, scale: auraScale }}
      />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
