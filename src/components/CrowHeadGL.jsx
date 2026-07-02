/* ============================================================================
   CrowHeadGL — the crow head as a REAL 3D model, watching the cursor.
   Same low-poly mesh as CrowHead3D (shared via crowHeadMesh.js), but rendered
   with Three.js/WebGL: flat-shaded standard materials under a lavender key +
   rim light, a faint wireframe overlay for the geometric brand language, and
   true spherical eyeballs whose pupils rotate in their sockets toward the
   pointer — with natural specular catch-lights from the key light.

   • Head: turns toward the pointer (damped yaw/pitch about the neck).
   • Eyes: eyeballs rotate to the pointer independently, faster than the head
     and clamped to their sockets; 3D eyelids blink now and then.
   • Idle: slow figure-eight look-around when the pointer rests; the whole
     head breathes. Aura + iris glow + rim light lift as the cursor nears.
   • Reduced motion: one static, forward-facing render — no loop.
   ========================================================================== */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MESH } from "./crowHeadMesh.js";
import styles from "./CrowHeadGL.module.css";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// mesh triangles (beak / skull split) → flat-shaded BufferGeometry
function toGeometry(beakOnly) {
  const pos = [];
  for (const [a, b, c, beak] of MESH.tris) {
    if (!!beak !== beakOnly) continue;
    pos.push(...MESH.verts[a], ...MESH.verts[b], ...MESH.verts[c]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals(); // unshared verts → per-face normals (faceted)
  return geo;
}

export default function CrowHeadGL({ className = "" }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const auraRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── scene ────────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0.12, 6.2);
    camera.lookAt(0, 0, 0);

    const head = new THREE.Group();
    head.scale.setScalar(1.22);
    scene.add(head);

    // plumage + beak — a black bird lit lavender, keratin sheen on the beak
    const skullMat = new THREE.MeshStandardMaterial({
      color: 0x413849,
      roughness: 0.58,
      metalness: 0.18,
      flatShading: true,
    });
    const beakMat = new THREE.MeshStandardMaterial({
      color: 0x5a4d6b,
      roughness: 0.32,
      metalness: 0.35,
      flatShading: true,
    });
    const skullGeo = toGeometry(false);
    const beakGeo = toGeometry(true);
    head.add(new THREE.Mesh(skullGeo, skullMat));
    head.add(new THREE.Mesh(beakGeo, beakMat));

    // faint facet wireframe — the geometric brand language over the model
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xcfc2e6,
      transparent: true,
      opacity: 0.13,
    });
    const wires = [new THREE.WireframeGeometry(skullGeo), new THREE.WireframeGeometry(beakGeo)];
    wires.forEach((w) => head.add(new THREE.LineSegments(w, wireMat)));

    // eyes — real eyeballs: luminous iris sphere + pupil at the front pole,
    // rotating in the socket; a hemispherical eyelid blinks over each
    const irisMat = new THREE.MeshStandardMaterial({
      color: 0xb7a6d6,
      emissive: 0x8a77ad,
      emissiveIntensity: 0.55,
      roughness: 0.18,
      metalness: 0.1,
    });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x241d29, roughness: 0.05 });
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0x413849,
      roughness: 0.6,
      metalness: 0.15,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    const eyePivots = [];
    const lids = [];
    for (const e of MESH.eyes) {
      const r = e.r * 0.98;
      const pivot = new THREE.Group(); // gaze rotation happens here
      // sunk into a socket: in profile the far eye hides behind the skull
      pivot.position.set(e.c[0] * 0.8, e.c[1], e.c[2]);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), irisMat);
      // large dark pupil — corvid eyes read nearly black, the iris is a rim
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(r * 0.58, 14, 10), pupilMat);
      pupil.position.set(0, 0, r * 0.66);
      pivot.add(iris, pupil);
      pivot.userData.baseY = Math.sign(e.c[0]) * 0.3; // eyes sit a touch outward
      head.add(pivot);
      eyePivots.push(pivot);

      const lidPivot = new THREE.Group(); // lids stay put while the gaze moves
      lidPivot.position.set(e.c[0] * 0.8, e.c[1], e.c[2]);
      const lid = new THREE.Mesh(
        new THREE.SphereGeometry(r * 1.18, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.62),
        lidMat,
      );
      lidPivot.add(lid);
      lidPivot.rotation.x = -1.15; // open — tucked back into the skull
      head.add(lidPivot);
      lids.push(lidPivot);
    }

    // lavender studio: dim ambient, bright key, rim from behind for silhouette
    scene.add(new THREE.AmbientLight(0x9b8bb8, 0.3));
    const key = new THREE.DirectionalLight(0xebe0ff, 1.35);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9b8bb8, 0.35);
    fill.position.set(2.5, -1, 2);
    scene.add(fill);
    const rim = new THREE.PointLight(0x9b8bb8, 2.0, 0, 1.8);
    rim.position.set(0, 0.8, -2.6);
    scene.add(rim);

    const resize = () => {
      const r = stage.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height || 1;
      camera.updateProjectionMatrix();
      if (reduce) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    if (reduce) {
      renderer.render(scene, camera);
      return () => {
        ro.disconnect();
        renderer.dispose();
      };
    }

    // ── cursor targets + idle wander + blink, damped each frame ─────────────
    let px = 0, py = 0; // normalized pointer, −1..1
    let nearT = 0, glow = 0;
    let lastMove = -1e4;
    let blinkStart = -1e4, nextBlink = 1600;
    let last = 0;

    const onMove = (e) => {
      lastMove = performance.now();
      const vcx = window.innerWidth / 2;
      const vcy = window.innerHeight * 0.46;
      px = clamp((e.clientX - vcx) / (window.innerWidth * 0.5), -1, 1);
      py = clamp((e.clientY - vcy) / (window.innerHeight * 0.5), -1, 1);
      const r = stage.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      nearT = clamp(1 - Math.hypot(dx, dy) / (r.width || 1), 0, 1);
    };

    let raf = 0;
    const tick = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;

      if (t - lastMove > 2600) {
        const s = t / 1000;
        px = 0.45 * Math.sin(s * 0.55);
        py = 0.26 * Math.sin(s * 0.9 + 1.2);
        nearT = 0.15;
      }

      // head follows slowly; eyes lead, clamped to their sockets
      const kHead = 1 - Math.exp(-6 * dt);
      const kEye = 1 - Math.exp(-16 * dt);
      head.rotation.y += (px * 0.62 - head.rotation.y) * kHead;
      head.rotation.x += (py * 0.38 - head.rotation.x) * kHead;
      const gy = clamp(px * 1.0 - head.rotation.y, -0.5, 0.5);
      const gx = clamp(py * 0.7 - head.rotation.x, -0.4, 0.4);
      const sy = Math.sin(head.rotation.y), cyw = Math.cos(head.rotation.y);
      for (let i = 0; i < eyePivots.length; i++) {
        const p = eyePivots[i];
        p.rotation.y += (p.userData.baseY * 0.4 + gy - p.rotation.y) * kEye;
        p.rotation.x += (gx - p.rotation.x) * kEye;
        // the far eye ducks behind the skull: fade it out once its socket
        // normal turns past the camera (same cutoff as the canvas renderer)
        const nx = Math.sign(MESH.eyes[i].c[0]) * 0.62;
        const nz = -nx * sy + 0.78 * cyw;
        const s = Math.max(0.001, clamp((nz - 0.3) / 0.25, 0, 1));
        p.scale.setScalar(s);
        lids[i].scale.setScalar(s);
      }

      // blink — quick shut/open sweep, occasionally double
      if (t > nextBlink) {
        blinkStart = t;
        nextBlink = t + 2400 + Math.random() * 4200 + (Math.random() < 0.3 ? 340 : 0);
      }
      const bp = (t - blinkStart) / 280;
      const lid = bp >= 0 && bp < 1 ? Math.sin(Math.PI * bp) : 0;
      for (const l of lids) l.rotation.x = -1.15 + lid * 1.3;

      // breath — slow swell + bob
      const ph = ((t % 7000) / 7000) * Math.PI * 2;
      head.position.y = 0.05 * Math.sin(ph);
      head.scale.setScalar(1.22 * (1 + 0.012 * Math.sin(ph)));

      // proximity: aura, iris glow and rim light lift together
      glow += (nearT - glow) * (1 - Math.exp(-8 * dt));
      if (auraRef.current) auraRef.current.style.opacity = String(0.5 + 0.5 * glow);
      irisMat.emissiveIntensity = 0.55 + 0.55 * glow;
      rim.intensity = 2.0 + 1.8 * glow;

      renderer.render(scene, camera);
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
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      [skullMat, beakMat, wireMat, irisMat, pupilMat, lidMat].forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={stageRef} className={`${styles.stage} ${className}`} aria-hidden="true">
      <div ref={auraRef} className={styles.aura} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
