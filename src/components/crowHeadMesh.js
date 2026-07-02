/* ============================================================================
   crowHeadMesh — the shared low-poly crow-head model, as pure data.
   A loft of cross-section rings along the head's spine (nape → crown → cheeks
   → forehead → beak → tip), triangulated with alternating diagonals + a hair
   of deterministic jitter so the facets read hand-cut, not machined.
   Consumed by CrowHead3D (canvas painter renderer) and CrowHeadGL (Three.js).
   Axes: x right, y up, z toward the viewer (beak points at you at rest).
   ========================================================================== */

const N = 10; // points per ring — coarse on purpose (low-poly)
const PIVOT_Z = 0.3; // rotate about the neck, not the beak
// each ring: z station, top/bottom extents, half-width; beak rings are marked
const RINGS = [
  { z: -0.88, top: 0.32, bot: -0.3, rx: 0.28 }, // nape
  { z: -0.6, top: 0.52, bot: -0.54, rx: 0.48 }, // back of skull
  { z: -0.26, top: 0.6, bot: -0.68, rx: 0.52 }, // flat corvid crown, full jaw
  { z: 0.1, top: 0.58, bot: -0.7, rx: 0.5 }, // cheeks
  { z: 0.42, top: 0.48, bot: -0.6, rx: 0.4 }, // below the eyes
  { z: 0.68, top: 0.36, bot: -0.44, rx: 0.3 }, // forehead → chin
  { z: 0.88, top: 0.3, bot: -0.24, rx: 0.17, beak: true }, // deep beak base
  { z: 1.16, top: 0.2, bot: -0.15, rx: 0.115, beak: true },
  { z: 1.44, top: 0.105, bot: -0.075, rx: 0.065, beak: true },
  { z: 1.66, top: 0.035, bot: -0.025, rx: 0.028, beak: true },
];
const TIP = [0, -0.04, 1.82 - PIVOT_Z]; // slight downward hook at the point
const BACK = [0, 0.02, -0.98 - PIVOT_Z];

// deterministic, mirror-symmetric jitter (same value for k and N−k)
const jit = (n) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s) - 0.5;
};

function buildMesh() {
  const verts = [];
  const rows = [];
  RINGS.forEach((rg, r) => {
    const row = [];
    const amp = rg.beak ? 0.014 : 0.038;
    for (let k = 0; k < N; k++) {
      const th = (k / N) * Math.PI * 2; // θ=0 at the top (culmen line)
      const c = Math.cos(th);
      const s = Math.sin(th);
      const m = Math.min(k, N - k);
      const x = rg.rx * s + jit(r * 57 + m * 13 + 1) * amp * Math.sign(s);
      const y = (c >= 0 ? rg.top * c : rg.bot * -c) + jit(r * 57 + m * 13 + 2) * amp;
      const z = rg.z - PIVOT_Z + jit(r * 57 + m * 13 + 3) * amp;
      row.push(verts.length);
      verts.push([x, y, z]);
    }
    rows.push(row);
  });
  const tipI = verts.length;
  verts.push(TIP);
  const backI = verts.length;
  verts.push(BACK);

  // orient every triangle outward at build time (radial test vs the spine)
  const tris = [];
  const addTri = (a, b, c, beak, zRef) => {
    const A = verts[a], B = verts[b], C = verts[c];
    const cx = (A[0] + B[0] + C[0]) / 3;
    const cy = (A[1] + B[1] + C[1]) / 3;
    const cz = (A[2] + B[2] + C[2]) / 3;
    const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2];
    const vx = C[0] - A[0], vy = C[1] - A[1], vz = C[2] - A[2];
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const out = nx * cx + ny * cy + nz * (cz - (zRef ?? cz));
    tris.push(out < 0 ? [a, c, b, beak] : [a, b, c, beak]);
  };

  for (let r = 0; r < RINGS.length - 1; r++) {
    const beak = !!(RINGS[r].beak || RINGS[r + 1].beak);
    for (let k = 0; k < N; k++) {
      const k2 = (k + 1) % N;
      const a = rows[r][k], b = rows[r][k2];
      const c = rows[r + 1][k2], d = rows[r + 1][k];
      if ((r + k) % 2) {
        addTri(a, b, c, beak);
        addTri(a, c, d, beak);
      } else {
        addTri(a, b, d, beak);
        addTri(b, c, d, beak);
      }
    }
  }
  const last = rows[rows.length - 1];
  for (let k = 0; k < N; k++) {
    addTri(tipI, last[k], last[(k + 1) % N], true, RINGS[RINGS.length - 1].z - PIVOT_Z);
  }
  for (let k = 0; k < N; k++) {
    addTri(backI, rows[0][(k + 1) % N], rows[0][k], false, RINGS[0].z - PIVOT_Z);
  }

  // eyes — side-set like a real crow, angled a touch forward
  const en = (x, y, z) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l];
  };
  const eyes = [
    { c: [-0.36, 0.16, 0.55 - PIVOT_Z], n: en(-0.62, 0.12, 0.78), r: 0.12 },
    { c: [0.36, 0.16, 0.55 - PIVOT_Z], n: en(0.62, 0.12, 0.78), r: 0.12 },
  ];
  return { verts, tris, eyes };
}

export const MESH = buildMesh();
