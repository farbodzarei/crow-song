import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// crow geometry (from components/Crow.jsx), drawn bold + on-brand for an icon
const BG = '#2E2633';
const STROKES = [
  // sacred circles (subtle framing)
  { t: 'circle', a: { cx: 69.26, cy: 69.26, r: 69.18 }, s: '#9B8BB8', o: 0.18, w: 0.6 },
  { t: 'circle', a: { cx: 69.26, cy: 69.26, r: 56.6 }, s: '#9B8BB8', o: 0.14, w: 0.6 },
  // body
  { t: 'polygon', a: { points: '69.26,31.52 91.27,56.68 69.26,94.41 47.25,56.68' }, s: '#C4B8D6', o: 0.95, w: 1.7 },
  { t: 'line', a: { x1: 69.26, y1: 31.52, x2: 69.26, y2: 94.41 }, s: '#C4B8D6', o: 0.5, w: 1.1 },
  // head + beak + eye ring
  { t: 'polygon', a: { points: '69.26,18.95 75.55,31.52 62.97,31.52' }, s: '#C4B8D6', o: 0.95, w: 1.7 },
  { t: 'polygon', a: { points: '69.26,18.95 79.32,16.43 75.55,25.23' }, s: '#EBE0FF', o: 0.9, w: 1.5 },
  { t: 'circle', a: { cx: 72.4, cy: 25.23, r: 2.52 }, s: '#C4B8D6', o: 0.7, w: 1.1 },
  // wing left
  { t: 'polygon', a: { points: '47.25,56.68 12.66,37.81 25.23,69.26 47.25,69.26' }, s: '#C4B8D6', o: 0.95, w: 1.7 },
  // wing right
  { t: 'polygon', a: { points: '91.27,56.68 125.86,37.81 113.28,69.26 91.27,69.26' }, s: '#C4B8D6', o: 0.95, w: 1.7 },
  // tail
  { t: 'polygon', a: { points: '69.26,94.41 47.25,125.86 58.18,103.22' }, s: '#C4B8D6', o: 0.9, w: 1.5 },
  { t: 'polygon', a: { points: '69.26,94.41 71.14,103.22 69.26,125.23 67.37,103.22' }, s: '#C4B8D6', o: 0.9, w: 1.5 },
  { t: 'polygon', a: { points: '80.33,103.22 91.27,125.86 69.26,94.41' }, s: '#C4B8D6', o: 0.9, w: 1.5 },
  // flight lines
  { t: 'line', a: { x1: 69.26, y1: 56.68, x2: 6.37, y2: 25.23 }, s: '#9B8BB8', o: 0.35, w: 0.8 },
  { t: 'line', a: { x1: 69.26, y1: 56.68, x2: 132.15, y2: 25.23 }, s: '#9B8BB8', o: 0.35, w: 0.8 },
];
const DOTS = [
  { cx: 72.4, cy: 25.23, r: 1.6, f: '#EBE0FF' },
];

function strokeEl(e) {
  const a = Object.entries(e.a).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${e.t} ${a} fill="none" stroke="${e.s}" stroke-opacity="${e.o}" stroke-width="${e.w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// center crow content (~x69, y78) in the icon box, scaled into the maskable safe zone
const inner = [...STROKES.map(strokeEl), ...DOTS.map(d => `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="${d.f}"/>`)].join('\n');
const svg = (maskable) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138.51 138.51">
  <rect width="138.51" height="138.51" fill="${BG}"/>
  <g transform="translate(69.255,69.255) scale(${maskable ? 0.7 : 0.78}) translate(-69.26,-78)">${inner}</g>
</svg>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
const targets = [
  { size: 512, file: 'public/icon-512.png', maskable: true },
  { size: 192, file: 'public/icon-192.png', maskable: true },
  { size: 180, file: 'public/apple-touch-icon.png', maskable: false },
];
for (const t of targets) {
  await page.setViewport({ width: t.size, height: t.size, deviceScaleFactor: 1 });
  const html = `<!doctype html><meta charset=utf8><style>*{margin:0}html,body{width:${t.size}px;height:${t.size}px}svg{width:${t.size}px;height:${t.size}px;display:block}</style>${svg(t.maskable)}`;
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: t.file, clip: { x: 0, y: 0, width: t.size, height: t.size } });
  console.log('wrote', t.file);
}
// also write a crisp brand favicon.svg (replaces the off-brand purple one)
writeFileSync('public/favicon.svg', svg(false));
console.log('wrote public/favicon.svg (on-brand crow)');
await browser.close();
