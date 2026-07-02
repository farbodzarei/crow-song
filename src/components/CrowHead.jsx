/* ============================================================================
   CrowHead — a geometric, faceted crow head that watches the cursor.

   • Head: banks in 3D toward the pointer (rotateX / rotateY on a perspective
     stage). The parts sit on separate depth planes (rings behind → skull →
     eyes → beak in front) so the bank produces genuine parallax, not a flat
     tilt. Brand language matches components/Crow.jsx (thin lavender facets on
     Crow-dark, sacred circles, faint fills).
   • Eyes: the pupils track the pointer *independently* of the head, leading it
     slightly and clamped inside their sockets — so the crow both turns to face
     you and follows you with its eyes.
   • Idle: when the pointer is still (or absent), it drifts through a slow
     autonomous look-around and blinks now and then, so it never feels frozen.
   • Reduced motion: renders a still, forward-facing head.
   ========================================================================== */

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import styles from "./CrowHead.module.css";

// palette — kept in step with components/Crow.jsx
const LV = "235,224,255"; // #ebe0ff  bright lavender
const SF = "196,184,214"; // #c4b8d6  soft lavender
const AC = "155,139,184"; // #9B8BB8  accent lavender
const CROW = "#2E2633"; // brand dark (pupil / behind-eyelid)

const VB = "0 0 220 220";

// ── geometry (viewBox units) ────────────────────────────────────────────────
// symmetric low-poly crow head, front-3/4. Sleek sloped crown + angular jaw so
// the silhouette reads corvid, not owl. Left points mirror to right (220 − x).
const HEAD =
  "110,20 72,38 48,74 60,120 86,150 110,150 134,150 160,120 172,74 148,38";

// interior facet lines that read the skull as planes
const FACETS = [
  [110, 20, 48, 74],
  [110, 20, 172, 74],
  [110, 20, 110, 84],
  [48, 74, 76, 88],
  [172, 74, 144, 88],
  [76, 88, 86, 150],
  [144, 88, 134, 150],
  [60, 120, 86, 124],
  [160, 120, 134, 124],
];

// keen angular brow ridges, angled down toward the beak for a corvid glare
const BROWS = [
  [50, 80, 92, 86],
  [170, 80, 128, 86],
];

// eyes: small, keen, set wide + high (side-set like a crow, not owl-frontal)
const EYE = { L: { cx: 76, cy: 88 }, R: { cx: 144, cy: 88 } };
const IRIS_R = 11;
const PUPIL_R = 4.6;
const SOCKET_R = 13; // eyelid/clip radius
// angular facet mask framing each eye (a diamond ridge, the corvid eye-line)
const EYE_MASK = {
  L: "60,88 76,77 92,88 76,99",
  R: "128,88 144,77 160,88 144,99",
};

// beak — the hero: a long, sharp, slightly-open corvid beak that juts toward
// the viewer on its own forward depth plane
const BEAK_UPPER = "97,84 123,84 110,166"; // stout upper mandible to a point
const BEAK_LOWER = "104,118 116,118 110,146"; // lower mandible, slight gape
const NOSTRILS = [
  [106, 94],
  [114, 94],
];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// small helpers to keep the JSX readable
function Line({ p, s = `rgba(${SF},0.28)`, w = 0.9 }) {
  return (
    <line
      x1={p[0]}
      y1={p[1]}
      x2={p[2]}
      y2={p[3]}
      stroke={s}
      strokeWidth={w}
      strokeLinecap="round"
    />
  );
}

export default function CrowHead({ className = "" }) {
  const reduce = useReducedMotion();
  const stageRef = useRef(null);

  // normalized pointer position relative to the head centre, each in −1..1
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // head bank — springy so it settles rather than snaps
  const headSpring = { stiffness: 110, damping: 18, mass: 0.7 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-26, 26]), headSpring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [20, -20]), headSpring);
  const shiftX = useSpring(useTransform(px, [-1, 1], [-10, 10]), headSpring);
  const shiftY = useSpring(useTransform(py, [-1, 1], [-7, 7]), headSpring);

  // pupils lead the head a touch and settle faster → they "look" first
  const pupilSpring = { stiffness: 240, damping: 22, mass: 0.5 };
  const pupilX = useSpring(useTransform(px, [-1, 1], [-6, 6]), pupilSpring);
  const pupilY = useSpring(useTransform(py, [-1, 1], [-5, 5]), pupilSpring);

  // aura brightens as the pointer nears the head
  const near = useMotionValue(0);
  const glow = useSpring(near, { stiffness: 80, damping: 20 });
  const auraOpacity = useTransform(glow, [0, 1], [0.5, 1]);
  const auraScale = useTransform(glow, [0, 1], [0.96, 1.08]);
  const irisBright = useTransform(glow, [0, 1], [1, 1.5]);
  const irisFilter = useMotionTemplate`brightness(${irisBright})`;

  // blink — scaleY on the eyelids, driven together
  const blink = useMotionValue(0); // 0 open → 1 shut
  const lidScaleY = useTransform(blink, [0, 1], [0, 1]);

  // ── pointer tracking + idle look-around + blinking ─────────────────────────
  useEffect(() => {
    if (reduce) return;

    let idle = true;
    let lastMove = performance.now();
    let raf = 0;

    const setFromPointer = (clientX, clientY) => {
      // normalize against the viewport half-extent so the head can watch the
      // pointer anywhere on screen, not just when it's over the head
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight * 0.46;
      const nx = clamp((clientX - cx) / (window.innerWidth * 0.5), -1, 1);
      const ny = clamp((clientY - cy) / (window.innerHeight * 0.5), -1, 1);
      px.set(nx);
      py.set(ny);

      // proximity glow keyed to distance from the head centre in px
      const el = stageRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const dx = clientX - (r.left + r.width / 2);
        const dy = clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) / (r.width || 1);
        near.set(clamp(1 - d, 0, 1));
      }
    };

    const onMove = (e) => {
      idle = false;
      lastMove = performance.now();
      setFromPointer(e.clientX, e.clientY);
    };

    // when the pointer is still, sweep a slow figure-eight so the gaze wanders
    const tick = (t) => {
      if (idle || t - lastMove > 2600) {
        idle = true;
        const s = t / 1000;
        px.set(0.45 * Math.sin(s * 0.55));
        py.set(0.26 * Math.sin(s * 0.9 + 1.2));
        near.set(0.15);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // occasional double/single blink
    let blinkTimer;
    const doBlink = () => {
      const shut = { duration: 0.07 };
      const open = { duration: 0.11 };
      blink
        .set(0);
      // sequence: shut → open, sometimes twice
      const seq = async () => {
        await animateValue(blink, 1, shut);
        await animateValue(blink, 0, open);
        if (Math.random() < 0.35) {
          await animateValue(blink, 1, shut);
          await animateValue(blink, 0, open);
        }
      };
      seq();
      blinkTimer = setTimeout(doBlink, 2600 + Math.random() * 4200);
    };
    blinkTimer = setTimeout(doBlink, 1600);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(blinkTimer);
    };
  }, [reduce, px, py, near, blink]);

  const eyelidStyle = {
    scaleY: reduce ? 0 : lidScaleY,
    transformBox: "fill-box",
    transformOrigin: "center",
  };

  const Skull = (
    <svg viewBox={VB} className={styles.svg}>
      {/* sacred circles — the site's recurring motif, echoed behind the head */}
      <circle cx="110" cy="110" r="104" fill="none" stroke={`rgba(${SF},0.14)`} strokeWidth="0.5" />
      <circle cx="110" cy="110" r="86" fill="none" stroke={`rgba(${SF},0.1)`} strokeWidth="0.5" />
      {/* skull silhouette + faint facet fill */}
      <polygon points={HEAD} fill={`rgba(${SF},0.05)`} stroke={`rgba(${LV},0.5)`} strokeWidth="1.1" strokeLinejoin="round" />
      {FACETS.map((p, i) => (
        <Line key={`f${i}`} p={p} />
      ))}
      {BROWS.map((p, i) => (
        <Line key={`b${i}`} p={p} s={`rgba(${LV},0.5)`} w={1.2} />
      ))}
    </svg>
  );

  const Eyes = (
    <svg viewBox={VB} className={styles.svg}>
      <defs>
        <radialGradient id="chIris" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={`rgba(${LV},0.95)`} />
          <stop offset="55%" stopColor={`rgba(${AC},0.85)`} />
          <stop offset="100%" stopColor={`rgba(${AC},0.15)`} />
        </radialGradient>
        <clipPath id="chEyeL">
          <circle cx={EYE.L.cx} cy={EYE.L.cy} r={SOCKET_R} />
        </clipPath>
        <clipPath id="chEyeR">
          <circle cx={EYE.R.cx} cy={EYE.R.cy} r={SOCKET_R} />
        </clipPath>
      </defs>

      {[EYE_MASK.L, EYE_MASK.R].map((pts, i) => (
        <g key={`eye${i}`}>
          {/* angular eye-line facet framing the eye — the keen corvid ridge */}
          <polygon points={pts} fill="none" stroke={`rgba(${SF},0.4)`} strokeWidth="0.9" strokeLinejoin="round" />
        </g>
      ))}
      {[EYE.L, EYE.R].map((e, i) => (
        /* luminous iris */
        <motion.circle key={`iris${i}`} cx={e.cx} cy={e.cy} r={IRIS_R} fill="url(#chIris)" style={{ filter: irisFilter }} />
      ))}

      {/* pupils — one group so both eyes look the same direction; tracks pointer */}
      <motion.g style={{ x: pupilX, y: pupilY }}>
        {[EYE.L, EYE.R].map((e, i) => (
          <g key={`pup${i}`}>
            <circle cx={e.cx} cy={e.cy} r={PUPIL_R} fill={CROW} stroke={`rgba(${LV},0.7)`} strokeWidth="0.6" />
            {/* small catch-light */}
            <circle cx={e.cx - 1.5} cy={e.cy - 1.6} r={1} fill={`rgba(${LV},0.85)`} />
          </g>
        ))}
      </motion.g>

      {/* eyelids — brand-dark shutters clipped to each socket, scaleY on blink */}
      <g clipPath="url(#chEyeL)">
        <motion.rect x={EYE.L.cx - SOCKET_R} y={EYE.L.cy - SOCKET_R} width={SOCKET_R * 2} height={SOCKET_R * 2} fill={CROW} style={eyelidStyle} />
      </g>
      <g clipPath="url(#chEyeR)">
        <motion.rect x={EYE.R.cx - SOCKET_R} y={EYE.R.cy - SOCKET_R} width={SOCKET_R * 2} height={SOCKET_R * 2} fill={CROW} style={eyelidStyle} />
      </g>
    </svg>
  );

  const Beak = (
    <svg viewBox={VB} className={styles.svg}>
      {/* upper mandible — solid, the head's strongest corvid signal */}
      <polygon points={BEAK_UPPER} fill={`rgba(${AC},0.22)`} stroke={`rgba(${LV},0.7)`} strokeWidth="1.2" strokeLinejoin="round" />
      {/* lower mandible, slightly agape */}
      <polygon points={BEAK_LOWER} fill={`rgba(46,38,51,0.65)`} stroke={`rgba(${SF},0.45)`} strokeWidth="0.7" strokeLinejoin="round" />
      {/* culmen ridge + its highlight */}
      <line x1="110" y1="84" x2="110" y2="166" stroke={`rgba(${SF},0.3)`} strokeWidth="0.6" />
      <line x1="107" y1="90" x2="110" y2="160" stroke={`rgba(${LV},0.3)`} strokeWidth="0.5" />
      {NOSTRILS.map((n, i) => (
        <circle key={`n${i}`} cx={n[0]} cy={n[1]} r={1} fill={`rgba(${LV},0.55)`} />
      ))}
    </svg>
  );

  // reduced motion: still, forward-facing, no listeners
  if (reduce) {
    return (
      <div ref={stageRef} className={`${styles.stage} ${className}`} aria-hidden="true">
        <div className={styles.aura} />
        {Skull}
        {Eyes}
        {Beak}
      </div>
    );
  }

  return (
    <div ref={stageRef} className={`${styles.stage} ${className}`} aria-hidden="true">
      <motion.div
        className={styles.tilt}
        style={{ rotateX, rotateY, x: shiftX, y: shiftY, transformPerspective: 1100 }}
      >
        <motion.div className={styles.aura} style={{ opacity: auraOpacity, scale: auraScale }} />
        <div className={styles.breath}>
          {/* depth planes: rings/skull back, eyes mid, beak forward */}
          <div className={styles.layer} style={{ transform: "translateZ(0px)" }}>{Skull}</div>
          <div className={styles.layer} style={{ transform: "translateZ(30px)" }}>{Eyes}</div>
          <div className={styles.layer} style={{ transform: "translateZ(52px)" }}>{Beak}</div>
        </div>
      </motion.div>
    </div>
  );
}

// tiny promise-based tween for a MotionValue (blink) without pulling in extra API
function animateValue(mv, to, { duration }) {
  return new Promise((resolve) => {
    const from = mv.get();
    const start = performance.now();
    const ms = duration * 1000;
    const step = (t) => {
      const k = Math.min(1, (t - start) / ms);
      // easeInOut
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      mv.set(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}
