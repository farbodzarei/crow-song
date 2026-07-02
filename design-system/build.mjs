/* ============================================================================
   Crow Song — Design System card generator.

   Emits self-contained HTML preview cards into ./cards/ for Claude Design
   (claude.ai/design). Each card:
     • inlines the real design tokens (kept verbatim with src/styles/tokens.css)
     • loads Raleway (+ ss09 stylistic set) from the deployed Vercel URLs
     • reuses the exact component / section CSS from the site
     • begins with a first-line  <!-- @dsCard … -->  marker the app indexes

   Run:  node design-system/build.mjs
   ========================================================================== */

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "cards");

const CDN = "https://crow-song-yoga.vercel.app";

/* ── token block — keep in sync with src/styles/tokens.css ─────────────────── */
const TOKENS = `:root{
  --c-mist:#F4F2F6; --c-haze:#E8E1EE; --c-soft:#C4B8D6; --c-lavender:#9B8BB8;
  --c-deep:#7A6A9A; --c-crow:#2E2633; --c-stone:#F7F6F5; --c-warm:#E8E6E3;
  --c-mid:#7D7A80; --c-charcoal:#1C1B1E; --c-white:#FFFFFF;
  --accent:var(--c-lavender); --accent-deep:var(--c-deep);
  --bg-dark:var(--c-crow); --bg-darker:var(--c-crow); --bg-light:var(--c-haze);
  --bg-light-lav:var(--c-haze); --bg-lav:var(--c-haze);
  --text-on-lav:var(--c-crow); --text-on-lav-muted:#5F5A68;
  --text-on-dark:var(--c-mist); --text-on-dark-muted:var(--c-soft);
  --text-on-light:var(--c-charcoal); --text-on-light-muted:#5F5A68;
  --w-thin:100; --w-xlight:200; --w-light:300; --w-reg:400; --w-med:500; --w-semi:600; --w-bold:700;
  --fs-display:clamp(3.5rem,9vw,7.5rem); --fs-h1:clamp(2.5rem,5.2vw,4.25rem);
  --fs-h2:clamp(2rem,3.8vw,2.9rem); --fs-h3:clamp(1.35rem,2vw,1.7rem);
  --fs-body:clamp(1.0625rem,0.55vw + 0.95rem,1.2rem); --fs-lead:clamp(1.2rem,1.6vw,1.5rem);
  --fs-small:clamp(0.9375rem,0.4vw + 0.85rem,1.0625rem); --fs-eyebrow:0.8125rem;
  --lh-body:1.7; --lh-lead:1.55; --lh-tight:1.12;
  --ls-display:0.04em; --ls-heading:0.045em; --ls-body:0.005em; --ls-eyebrow:0.24em;
  --s-1:0.5rem; --s-2:1rem; --s-3:1.5rem; --s-4:2rem; --s-5:2.5rem; --s-6:3rem;
  --s-8:4rem; --s-10:5rem; --s-12:6rem; --s-16:8rem; --s-20:10rem; --s-24:12rem;
  --container:2240px; --container-pad:clamp(1.5rem,5vw,3.75rem); --section-y:clamp(3.5rem,10vw,11rem);
  --radius:14px; --radius-sm:8px; --rule-w:40px;
  --ease-breath:cubic-bezier(0.16,1,0.3,1); --dur-fast:0.6s; --dur-slow:1.1s; --dur-slower:1.4s;
  --z-base:0; --z-raised:1; --z-nav:100; --z-overlay:200; --z-cursor:9000;
  --font-sans:"Raleway",system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;
}`;

const FONTS = `
@font-face{font-family:"Raleway";
  src:url("${CDN}/fonts/Raleway/Raleway-VariableFont_wght.ttf") format("truetype-variations"),
      url("${CDN}/fonts/Raleway/Raleway-VariableFont_wght.ttf") format("truetype");
  font-weight:100 700; font-style:normal; font-display:swap;}
@font-face{font-family:"Raleway";
  src:url("${CDN}/fonts/Raleway/Raleway-Italic-VariableFont_wght.ttf") format("truetype-variations"),
      url("${CDN}/fonts/Raleway/Raleway-Italic-VariableFont_wght.ttf") format("truetype");
  font-weight:100 700; font-style:italic; font-display:swap;}
@font-feature-values "Raleway"{@styleset{custom-w:9;}}`;

const FRAME = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{font-feature-settings:"ss09" 1;font-variant-alternates:styleset(custom-w);
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;}
body{font-family:var(--font-sans);font-weight:var(--w-reg);font-size:var(--fs-body);
  line-height:var(--lh-body);letter-spacing:var(--ls-body);font-synthesis:none;
  min-height:100vh;display:grid;place-items:center;padding:56px;}
body.dark{background:var(--bg-dark);color:var(--text-on-dark);}
body.light{background:var(--bg-light);color:var(--text-on-light);}
img,svg{display:block;max-width:100%;}
a{color:inherit;text-decoration:none;}
button{font:inherit;color:inherit;background:none;border:none;cursor:pointer;}
::selection{background:rgba(155,139,184,0.9);color:var(--c-crow);}
.stage{width:100%;max-width:var(--stage-w,960px);}
.eyebrow{font-size:var(--fs-eyebrow);font-weight:var(--w-med);letter-spacing:var(--ls-eyebrow);text-transform:uppercase;}
.cap{font-size:var(--fs-eyebrow);letter-spacing:0.22em;text-transform:uppercase;opacity:0.5;}
.row{display:flex;gap:28px;flex-wrap:wrap;align-items:center;}
.col{display:flex;flex-direction:column;}`;

/* one card → one self-contained HTML document */
function page({ group, name, w, h, surface, stageW, head = "", body }) {
  const marker = `<!-- @dsCard group="${group}" name="${name}" width="${w}" height="${h}" -->`;
  return `${marker}
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name} — Crow Song</title>
<style>
${TOKENS}
${FONTS}
${FRAME}
${stageW ? `.stage{max-width:${stageW}px;}` : ""}
${head}
</style>
</head>
<body class="${surface}">
<div class="stage">
${body}
</div>
</body>
</html>`;
}

/* ── card definitions ──────────────────────────────────────────────────────── */
const cards = [];
const add = (c) => cards.push(c);

/* —— FOUNDATIONS ———————————————————————————————————————————————————————————— */

add({
  slug: "foundation-colors", group: "Foundations", name: "Colors",
  w: 1120, h: 640, surface: "light", stageW: 1000,
  head: `
.sw{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border-radius:var(--radius);overflow:hidden;}
.chip{padding:26px 24px 22px;display:flex;flex-direction:column;gap:6px;min-height:148px;justify-content:flex-end;}
.chip b{font-weight:var(--w-med);font-size:1rem;letter-spacing:0.02em;}
.chip .hex{font-size:var(--fs-small);opacity:0.7;font-variant-numeric:tabular-nums;}
.chip .role{font-size:var(--fs-eyebrow);letter-spacing:0.16em;text-transform:uppercase;opacity:0.55;margin-top:4px;}
.title{font-size:var(--fs-h3);font-weight:var(--w-light);margin-bottom:var(--s-4);}`,
  body: `
<h1 class="title">colour</h1>
<div class="sw">
  <div class="chip" style="background:#2E2633;color:#F4F2F6"><b>Crow</b><span class="hex">#2E2633</span><span class="role">dark background</span></div>
  <div class="chip" style="background:#E8E1EE;color:#2E2633"><b>Haze</b><span class="hex">#E8E1EE</span><span class="role">light background</span></div>
  <div class="chip" style="background:#9B8BB8;color:#2E2633"><b>Lavender</b><span class="hex">#9B8BB8</span><span class="role">accent only</span></div>
  <div class="chip" style="background:#F4F2F6;color:#2E2633"><b>Mist</b><span class="hex">#F4F2F6</span><span class="role">text on dark</span></div>
  <div class="chip" style="background:#C4B8D6;color:#2E2633"><b>Soft</b><span class="hex">#C4B8D6</span><span class="role">muted on dark</span></div>
  <div class="chip" style="background:#7A6A9A;color:#F4F2F6"><b>Deep</b><span class="hex">#7A6A9A</span><span class="role">accent-deep</span></div>
  <div class="chip" style="background:#1C1B1E;color:#F4F2F6"><b>Charcoal</b><span class="hex">#1C1B1E</span><span class="role">text on light</span></div>
  <div class="chip" style="background:#5F5A68;color:#F4F2F6"><b>Muted</b><span class="hex">#5F5A68</span><span class="role">muted on light · AA</span></div>
  <div class="chip" style="background:#F4F2F6;color:#2E2633;border:1px solid rgba(46,38,51,.12)"><b>White</b><span class="hex">#FFFFFF</span><span class="role">rarely — pure</span></div>
</div>`,
});

add({
  slug: "foundation-typography", group: "Foundations", name: "Typography",
  w: 1120, h: 840, surface: "dark", stageW: 1000,
  head: `
.spec{display:flex;flex-direction:column;gap:0;}
.line{display:flex;align-items:baseline;gap:24px;padding:14px 0;border-bottom:1px solid rgba(155,139,184,0.12);}
.line .meta{flex:none;width:150px;font-size:var(--fs-eyebrow);letter-spacing:0.16em;text-transform:uppercase;color:var(--accent);opacity:0.85;}
.d{font-size:3.2rem;font-weight:var(--w-thin);letter-spacing:var(--ls-display);line-height:1.05;color:var(--c-mist);}
.h1{font-size:2.4rem;font-weight:var(--w-xlight);color:var(--c-mist);}
.h2{font-size:1.9rem;font-weight:var(--w-light);color:var(--c-mist);}
.h3{font-size:var(--fs-h3);font-weight:var(--w-med);color:var(--c-mist);}
.bd{font-size:var(--fs-body);font-weight:var(--w-reg);color:var(--text-on-dark);}
.it{font-style:italic;font-weight:var(--w-xlight);font-size:1.5rem;color:var(--c-soft);}
.note{margin-top:var(--s-4);font-size:var(--fs-small);color:var(--text-on-dark-muted);}
.note b{color:var(--accent);font-weight:var(--w-med);}`,
  body: `
<div class="spec">
  <div class="line"><span class="meta">display · 100</span><span class="d">Crow Song</span></div>
  <div class="line"><span class="meta">h1 · 200</span><span class="h1">Find your breath</span></div>
  <div class="line"><span class="meta">h2 · 300</span><span class="h2">Adapted to you</span></div>
  <div class="line"><span class="meta">h3 · 500</span><span class="h3">Yoga Chikitsa</span></div>
  <div class="line"><span class="meta">italic · 200</span><span class="it">between worlds</span></div>
  <div class="line"><span class="meta">body · 400</span><span class="bd">Therapeutic Ashtanga for bodies in transition.</span></div>
  <div class="line"><span class="meta">eyebrow · 500</span><span class="eyebrow" style="color:var(--accent)">the practice</span></div>
</div>
<p class="note">Raleway, one family. The <b>ss09</b> stylistic set swaps the default <b>W</b> site-wide — Wisdom · Wonder · Withind. Weights 100–700, variable axis.</p>`,
});

add({
  slug: "foundation-spacing", group: "Foundations", name: "Spacing",
  w: 940, h: 660, surface: "light", stageW: 760,
  head: `
.row2{display:flex;align-items:center;gap:18px;padding:7px 0;}
.row2 .k{flex:none;width:62px;font-size:var(--fs-small);font-variant-numeric:tabular-nums;color:var(--text-on-light-muted);}
.row2 .px{flex:none;width:64px;font-size:var(--fs-eyebrow);color:var(--text-on-light-muted);opacity:0.7;}
.bar{height:18px;background:var(--accent);border-radius:3px;}
.title{font-size:var(--fs-h3);font-weight:var(--w-light);margin-bottom:var(--s-4);}`,
  body: `
<h1 class="title">spacing scale</h1>
${[["s-1",8],["s-2",16],["s-3",24],["s-4",32],["s-5",40],["s-6",48],["s-8",64],["s-10",80],["s-12",96],["s-16",128]]
  .map(([t,px]) => `<div class="row2"><span class="k">--${t}</span><span class="bar" style="width:${px}px"></span><span class="px">${px}px</span></div>`).join("\n")}`,
});

add({
  slug: "foundation-shape", group: "Foundations", name: "Shape & motion",
  w: 940, h: 540, surface: "light", stageW: 820,
  head: `
.box{width:150px;height:104px;background:var(--c-crow);display:grid;place-items:center;color:var(--c-soft);font-size:var(--fs-eyebrow);letter-spacing:0.14em;text-transform:uppercase;}
.r14{border-radius:14px;} .r8{border-radius:8px;}
.rule{display:block;width:var(--rule-w);height:2px;background:var(--accent);border-radius:2px;}
.lbl{font-size:var(--fs-eyebrow);letter-spacing:0.18em;text-transform:uppercase;opacity:0.55;margin-top:12px;}
.title{font-size:var(--fs-h3);font-weight:var(--w-light);margin-bottom:var(--s-5);}
.ease{margin-top:var(--s-5);font-size:var(--fs-small);color:var(--text-on-light-muted);}
.ease b{color:var(--text-on-light);font-weight:var(--w-med);}`,
  body: `
<h1 class="title">shape &amp; motion</h1>
<div class="row" style="gap:48px;align-items:flex-start">
  <div class="col"><div class="box r14">radius</div><span class="lbl">--radius · 14px</span></div>
  <div class="col"><div class="box r8">radius-sm</div><span class="lbl">--radius-sm · 8px</span></div>
  <div class="col" style="justify-content:center"><span class="rule"></span><span class="lbl">--rule-w · 40px</span></div>
</div>
<p class="ease"><b>--ease-breath</b> cubic-bezier(.16, 1, .3, 1) &nbsp;·&nbsp; durations <b>.6s / 1.1s / 1.4s</b> — slow, like an exhale.</p>`,
});

/* —— COMPONENTS ————————————————————————————————————————————————————————————— */

add({
  slug: "component-button", group: "Components", name: "Button",
  w: 940, h: 540, surface: "dark", stageW: 720,
  head: `
.btn{position:relative;display:inline-flex;align-items:center;justify-content:center;padding:16px 34px;
  border-radius:var(--radius-sm);font-size:var(--fs-small);font-weight:var(--w-med);letter-spacing:0.14em;
  text-transform:uppercase;overflow:hidden;
  transition:border-color var(--dur-slow) var(--ease-breath),color var(--dur-slow) var(--ease-breath),opacity var(--dur-slow) var(--ease-breath);}
.btn .label{position:relative;z-index:1;}
.wipe{color:var(--c-white);background:transparent;border:1px solid rgba(155,139,184,0.5);}
.wipe::before{content:"";position:absolute;inset:0;background:var(--accent);transform:translateX(-101%);transition:transform var(--dur-slow) var(--ease-breath);}
.wipe:hover{color:var(--c-crow);border-color:var(--accent);}
.wipe:hover::before{transform:translateX(0);}
.solid{color:var(--c-white);background:var(--c-crow);border:1px solid var(--c-crow);padding:18px 44px;}
.solid:hover{opacity:0.82;}
.btn:active{transform:scale(0.97);}
.title{font-size:var(--fs-h3);font-weight:var(--w-light);color:var(--c-mist);margin-bottom:var(--s-5);}
.grp{display:flex;gap:40px;flex-wrap:wrap;}
.cell{display:flex;flex-direction:column;gap:16px;align-items:flex-start;}
.cap{color:var(--text-on-dark-muted);opacity:0.7;}`,
  body: `
<h1 class="title">button</h1>
<div class="grp">
  <div class="cell"><button class="btn wipe cursor-target"><span class="label">book a session</span></button><span class="cap">wipe · default · hover fills lavender</span></div>
  <div class="cell"><button class="btn solid cursor-target"><span class="label">book a session</span></button><span class="cap">solid · crow fill</span></div>
</div>`,
});

add({
  slug: "component-divider", group: "Components", name: "Divider",
  w: 720, h: 360, surface: "light", stageW: 520,
  head: `
.rule{display:block;width:var(--rule-w);height:2px;background:var(--accent);border-radius:2px;}
.start{margin-inline:0;} .center{margin-inline:auto;}
.cell{padding:20px 0;}
.title{font-size:var(--fs-h3);font-weight:var(--w-light);margin-bottom:var(--s-5);}`,
  body: `
<h1 class="title">divider</h1>
<div class="cell"><span class="rule start"></span><div class="cap" style="margin-top:12px">align · start</div></div>
<div class="cell"><span class="rule center"></span><div class="cap" style="margin-top:12px;text-align:center">align · center</div></div>`,
});

add({
  slug: "component-logo", group: "Components", name: "Logo",
  w: 1000, h: 540, surface: "light", stageW: 760,
  head: `
.lrow{display:flex;align-items:center;justify-content:center;height:120px;border-radius:var(--radius);margin-bottom:2px;}
.onDark{background:var(--c-crow);} .onLight{background:var(--c-haze);border:1px solid rgba(46,38,51,0.1);}
.lrow img{width:234px;height:45px;}
.title{font-size:var(--fs-h3);font-weight:var(--w-light);margin-bottom:var(--s-4);}
.cap{margin:10px 2px 22px;}`,
  body: `
<h1 class="title">logo</h1>
<div class="lrow onDark"><img src="${CDN}/logo/crow-song-light.svg" alt="Crow Song Yoga Therapy" width="234" height="45"></div>
<div class="cap">light · on crow</div>
<div class="lrow onLight"><img src="${CDN}/logo/crow-song-dark.svg" alt="Crow Song Yoga Therapy" width="234" height="45"></div>
<div class="cap">dark · on haze</div>`,
});

add({
  slug: "component-image-placeholder", group: "Components", name: "Image placeholder",
  w: 940, h: 600, surface: "light", stageW: 760,
  head: `
.ph{position:relative;width:100%;border-radius:var(--radius);overflow:hidden;
  background:linear-gradient(150deg,var(--c-haze) 0%,var(--c-soft) 120%);display:grid;place-items:center;isolation:isolate;}
.ph::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 100% at 50% 0%,rgba(255,255,255,0.25) 0%,rgba(46,38,51,0.06) 100%);pointer-events:none;}
.frame{position:absolute;inset:14px;border:1px solid rgba(46,38,51,0.14);border-radius:8px;}
.ph .label{position:relative;z-index:1;font-size:var(--fs-eyebrow);font-weight:var(--w-med);letter-spacing:var(--ls-eyebrow);text-transform:uppercase;color:rgba(46,38,51,0.5);}
.title{font-size:var(--fs-h3);font-weight:var(--w-light);margin-bottom:var(--s-4);}
.phrow{display:grid;grid-template-columns:200px 1fr;gap:28px;align-items:start;}`,
  body: `
<h1 class="title">image placeholder</h1>
<div class="phrow">
  <div class="ph" style="aspect-ratio:4/5"><span class="frame"></span><span class="label">christine — portrait</span></div>
  <div class="ph" style="aspect-ratio:16/9"><span class="frame"></span><span class="label">studio · 16 / 9</span></div>
</div>`,
});

add({
  slug: "component-eyebrow", group: "Components", name: "Eyebrow",
  w: 720, h: 320, surface: "light", stageW: 520,
  head: `
.title{font-size:var(--fs-h3);font-weight:var(--w-light);margin-bottom:var(--s-5);}
.eblist{display:flex;flex-direction:column;gap:18px;}
.e-lav{color:var(--accent-deep);} .e-mut{color:var(--text-on-lav-muted);}`,
  body: `
<h1 class="title">eyebrow</h1>
<div class="eblist">
  <span class="eyebrow e-lav">the practice</span>
  <span class="eyebrow e-mut">what this is</span>
  <span class="eyebrow e-lav">one-on-one sessions</span>
</div>`,
});

/* —— PATTERNS ——————————————————————————————————————————————————————————————— */

add({
  slug: "pattern-eyebrow-heading", group: "Patterns", name: "Eyebrow + heading",
  w: 1000, h: 560, surface: "light", stageW: 720,
  head: `
.kicker{color:var(--accent-deep);margin-bottom:var(--s-5);display:block;}
.heading{font-size:clamp(2.6rem,4.4vw,3.6rem);font-weight:var(--w-xlight);line-height:1.12;letter-spacing:-0.02em;color:var(--text-on-light);}`,
  body: `
<span class="eyebrow kicker">what this is</span>
<h2 class="heading">One-on-one.<br>Adapted.<br>For you.</h2>`,
});

add({
  slug: "pattern-service-card", group: "Patterns", name: "Service card",
  w: 1000, h: 560, surface: "light", stageW: 360,
  head: `
.card{display:flex;flex-direction:column;gap:var(--s-2);padding:var(--s-6);background:var(--c-crow);color:var(--text-on-dark);border-radius:var(--radius);transition:background var(--dur-slow) var(--ease-breath);}
.card:hover{background:color-mix(in srgb, var(--c-crow), var(--c-lavender) 12%);}
.tag{font-size:var(--fs-eyebrow);font-weight:var(--w-reg);letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);}
.cardTitle{font-size:var(--fs-h3);font-weight:var(--w-light);line-height:1.3;letter-spacing:-0.01em;color:var(--c-white);}
.cardDesc{font-size:var(--fs-small);font-weight:var(--w-light);line-height:1.7;color:rgba(244,242,246,0.66);}
.arrow{margin-top:var(--s-4);font-size:1.25rem;color:rgba(155,139,184,0.45);transition:color var(--dur-slow) var(--ease-breath),transform var(--dur-slow) var(--ease-breath);}
.card:hover .arrow{color:var(--accent);transform:translateX(5px);}`,
  body: `
<article class="card">
  <span class="tag">recovery</span>
  <h3 class="cardTitle">Injury and recovery</h3>
  <p class="cardDesc">Therapeutic movement for those navigating chronic pain, post-surgery recovery, or long-term injury.</p>
  <span class="arrow">&rarr;</span>
</article>`,
});

add({
  slug: "pattern-testimonial-card", group: "Patterns", name: "Testimonial card",
  w: 1000, h: 520, surface: "dark", stageW: 520,
  head: `
.card{background:var(--c-crow);padding:var(--s-8);border:1px solid rgba(155,139,184,0.1);border-radius:var(--radius);}
.quote{font-size:clamp(1.05rem,1.6vw,1.3rem);font-weight:var(--w-xlight);font-style:italic;line-height:1.65;color:var(--c-mist);margin-bottom:var(--s-4);}
.cite{font-size:var(--fs-eyebrow);letter-spacing:0.28em;text-transform:lowercase;color:var(--accent);}`,
  body: `
<figure class="card">
  <blockquote class="quote">“christine holds space unlike anyone I’ve encountered. there’s a quality of attention she brings that I’ve genuinely never experienced elsewhere.”</blockquote>
  <figcaption class="cite">— p.m., anxiety &amp; burnout</figcaption>
</figure>`,
});

add({
  slug: "pattern-pricing-card", group: "Patterns", name: "Pricing tiers",
  w: 1160, h: 760, surface: "dark", stageW: 1000,
  head: `
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(155,139,184,0.08);border-radius:var(--radius);overflow:hidden;}
.card{background:var(--c-crow);padding:var(--s-6) var(--s-5);display:flex;flex-direction:column;}
.featured{position:relative;z-index:var(--z-raised);background:radial-gradient(130% 95% at 82% 8%,rgba(155,139,184,0.42),transparent 54%),linear-gradient(158deg,var(--c-haze) 0%,var(--c-lavender) 150%);color:var(--text-on-lav);border-radius:var(--radius);}
.label{font-size:var(--fs-eyebrow);letter-spacing:0.38em;text-transform:lowercase;color:var(--accent);margin-bottom:var(--s-3);}
.featured .label{color:var(--text-on-lav-muted);}
.cardTitle{font-size:1.5rem;font-weight:var(--w-xlight);color:var(--c-mist);text-transform:lowercase;margin-bottom:var(--s-1);}
.featured .cardTitle{color:var(--c-crow);}
.price{font-variant-numeric:tabular-nums;font-weight:var(--w-thin);font-size:2.6rem;line-height:1;color:var(--c-mist);margin:var(--s-3) 0;}
.featured .price{color:var(--c-crow);}
.price sup{font-size:0.45em;font-weight:var(--w-light);vertical-align:super;}
.price span{font-size:0.32em;font-weight:var(--w-light);color:rgba(244,242,246,0.45);}
.featured .price span{color:rgba(46,38,51,0.5);}
.list{list-style:none;margin:var(--s-3) 0 var(--s-5);flex:1;}
.list li{font-size:var(--fs-small);padding:var(--s-2) 0;border-bottom:1px solid rgba(155,139,184,0.1);color:rgba(244,242,246,0.68);line-height:1.5;}
.list li::before{content:"— ";color:rgba(155,139,184,0.5);}
.featured .list li{border-bottom-color:rgba(46,38,51,0.16);color:var(--c-crow);}
.featured .list li::before{color:rgba(46,38,51,0.4);}
.btnGhost{align-self:flex-start;font-size:var(--fs-small);letter-spacing:0.18em;text-transform:lowercase;font-weight:var(--w-light);color:rgba(244,242,246,0.6);border-bottom:1px solid rgba(155,139,184,0.35);padding-bottom:2px;}
.btnCrow{align-self:flex-start;font-size:var(--fs-small);letter-spacing:0.18em;text-transform:lowercase;font-weight:var(--w-reg);background:var(--c-crow);color:var(--c-mist);padding:12px 28px;border-radius:var(--radius-sm);}`,
  body: `
<div class="grid">
  <div class="card">
    <span class="label">single session</span>
    <h3 class="cardTitle">try the practice</h3>
    <div class="price"><sup>$</sup>160 <span>/ 75 min</span></div>
    <ul class="list"><li>one-on-one with christine</li><li>personalised to your needs</li><li>take-home practices</li></ul>
    <a class="btnGhost">book a session</a>
  </div>
  <div class="card featured">
    <span class="label">recommended</span>
    <h3 class="cardTitle">monthly practice</h3>
    <div class="price"><sup>$</sup>540 <span>/ month</span></div>
    <ul class="list"><li>4 sessions per month</li><li>between-session support</li><li>evolving personal practice</li><li>home practice recordings</li></ul>
    <a class="btnCrow">begin</a>
  </div>
  <div class="card">
    <span class="label">deep dive</span>
    <h3 class="cardTitle">intake + series</h3>
    <div class="price"><sup>$</sup>920 <span>/ 6 sessions</span></div>
    <ul class="list"><li>extended intake session</li><li>5 follow-up sessions</li><li>full body-system assessment</li><li>written practice plan</li></ul>
    <a class="btnGhost">book a session</a>
  </div>
</div>`,
});

add({
  slug: "pattern-numbered-item", group: "Patterns", name: "Numbered list",
  w: 940, h: 540, surface: "light", stageW: 620,
  head: `
.pillars{list-style:none;}
.pillar{display:flex;align-items:baseline;gap:var(--s-4);padding-block:var(--s-4);border-bottom:1px solid rgba(46,38,51,0.1);}
.pillar:first-child{border-top:1px solid rgba(46,38,51,0.1);}
.num{flex:none;min-width:2ch;font-size:var(--fs-small);font-weight:var(--w-reg);color:var(--accent-deep);letter-spacing:0.06em;}
.pillarText{font-size:var(--fs-lead);font-weight:var(--w-reg);line-height:1.4;letter-spacing:-0.01em;color:var(--text-on-light);}`,
  body: `
<ol class="pillars">
  <li class="pillar"><span class="num">01</span><span class="pillarText">Private sessions tailored to your body</span></li>
  <li class="pillar"><span class="num">02</span><span class="pillarText">Grounded in traditional Ashtanga lineage</span></li>
  <li class="pillar"><span class="num">03</span><span class="pillarText">Adapted for injury, recovery and transition</span></li>
  <li class="pillar"><span class="num">04</span><span class="pillarText">Breath-centred and deeply therapeutic</span></li>
</ol>`,
});

add({
  slug: "pattern-accordion", group: "Patterns", name: "Accordion (FAQ)",
  w: 940, h: 540, surface: "light", stageW: 720,
  head: `
.list{max-width:760px;}
.item{border-top:1px solid rgba(46,38,51,0.18);}
.item:last-child{border-bottom:1px solid rgba(46,38,51,0.18);}
.q{width:100%;display:flex;justify-content:space-between;align-items:center;gap:var(--s-4);padding:var(--s-4) 0;text-align:left;
  font-size:1.15rem;font-weight:var(--w-light);color:var(--text-on-lav);text-transform:lowercase;}
.sign{position:relative;flex:none;width:16px;height:16px;}
.sign::before,.sign::after{content:"";position:absolute;top:50%;left:50%;width:14px;height:1.5px;background:var(--c-crow);transform:translate(-50%,-50%);}
.sign::after{transform:translate(-50%,-50%) rotate(90deg);}
.itemOpen .sign::after{opacity:0;}
.a{padding-bottom:var(--s-4);max-width:60ch;}
.a p{font-size:var(--fs-small);font-weight:var(--w-light);line-height:1.8;color:var(--text-on-lav-muted);}`,
  body: `
<div class="list">
  <div class="item itemOpen">
    <button class="q">do i need to know yoga to start?<span class="sign"></span></button>
    <div class="a"><p>not at all. yoga therapy meets you where you are. many clients come with no yoga background — and that’s often an advantage. we build from the ground up, for your body specifically.</p></div>
  </div>
  <div class="item"><button class="q">where do sessions take place?<span class="sign"></span></button></div>
  <div class="item"><button class="q">is there a sliding scale?<span class="sign"></span></button></div>
</div>`,
});

add({
  slug: "pattern-membership-band", group: "Patterns", name: "Membership band",
  w: 1200, h: 780, surface: "light", stageW: 1040,
  head: `
.band{background:var(--c-crow);color:var(--text-on-dark);padding:var(--s-10);border-radius:var(--radius);display:grid;grid-template-columns:1.5fr 1fr;gap:var(--s-10);align-items:center;}
.bandTitle{font-weight:var(--w-thin);font-size:2.4rem;line-height:1.15;color:var(--c-mist);text-transform:lowercase;margin-bottom:var(--s-3);}
.bandTitle em{font-style:italic;color:var(--accent);}
.bandBody{font-size:var(--fs-body);font-weight:var(--w-light);line-height:1.8;color:rgba(244,242,246,0.62);max-width:42ch;}
.bandPrice{font-variant-numeric:tabular-nums;font-weight:var(--w-thin);font-size:3.25rem;line-height:1;color:var(--c-mist);margin:var(--s-4) 0 var(--s-1);}
.bandPrice sup{font-size:0.42em;font-weight:var(--w-light);vertical-align:super;}
.bandNote{font-size:var(--fs-small);color:rgba(244,242,246,0.45);}
.perks{list-style:none;border:1px solid rgba(155,139,184,0.2);padding:var(--s-6);border-radius:var(--radius-sm);}
.perks li{font-size:var(--fs-small);color:rgba(244,242,246,0.78);padding:var(--s-2) 0;border-bottom:1px solid rgba(155,139,184,0.12);display:flex;gap:var(--s-2);align-items:baseline;}
.perks li:last-child{border-bottom:none;}
.perks li::before{content:"✦";font-size:0.6em;color:var(--accent);flex-shrink:0;}`,
  body: `
<div class="band">
  <div>
    <h3 class="bandTitle">the crow song <em>collective</em></h3>
    <p class="bandBody">a monthly membership for those who want to deepen their practice beyond the one-on-one. live sessions, a growing practice library, community, and direct access to christine.</p>
    <div class="bandPrice"><sup>$</sup>88</div>
    <p class="bandNote">per month · cancel any time</p>
  </div>
  <ul class="perks">
    <li>2 live group sessions per month with christine</li>
    <li>full access to the practice library (60+ recordings)</li>
    <li>monthly q&amp;a call — ask anything</li>
    <li>private community space</li>
    <li>early access to new courses</li>
  </ul>
</div>`,
});

/* ── emit ──────────────────────────────────────────────────────────────────── */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const c of cards) {
  writeFileSync(join(OUT, `${c.slug}.html`), page(c), "utf8");
}
console.log(`✓ wrote ${cards.length} cards → ${OUT}`);
for (const c of cards) console.log(`  · [${c.group}] ${c.name}  (${c.slug}.html)`);
