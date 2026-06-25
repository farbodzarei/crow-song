import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ORIGIN = 'http://localhost:5191';

const html = `<!doctype html><meta charset=utf8>
<style>
  @font-face{font-family:Raleway;src:url('${ORIGIN}/fonts/Raleway/Raleway-VariableFont_wght.ttf') format('truetype-variations');font-weight:100 700;font-display:block;}
  *{margin:0;box-sizing:border-box}
  html,body{width:1200px;height:630px}
  .card{position:relative;width:1200px;height:630px;background:#2E2633;overflow:hidden;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    font-family:Raleway,sans-serif;color:#F4F2F6;text-align:center}
  .glow{position:absolute;top:-220px;right:-160px;width:760px;height:760px;
    background:radial-gradient(circle,rgba(155,139,184,0.20),transparent 62%);pointer-events:none}
  .glow2{position:absolute;bottom:-260px;left:-180px;width:680px;height:680px;
    background:radial-gradient(circle,rgba(155,139,184,0.10),transparent 64%);pointer-events:none}
  .crow{width:184px;height:184px;margin-bottom:34px;position:relative}
  .word{font-size:78px;font-weight:300;letter-spacing:.02em;line-height:1;position:relative}
  .tag{margin-top:26px;font-size:28px;font-weight:300;letter-spacing:.01em;color:rgba(196,184,214,.92);position:relative}
  .tag em{font-style:italic;color:#C4B8D6}
  .label{margin-top:30px;font-size:17px;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:#9B8BB8;position:relative}
  .rule{width:46px;height:1px;background:rgba(155,139,184,.5);margin-top:30px}
</style>
<div class="card">
  <div class="glow"></div><div class="glow2"></div>
  <img class="crow" src="${ORIGIN}/favicon.svg" />
  <div class="word">crow song</div>
  <div class="tag">therapeutic ashtanga for bodies <em>in transition</em></div>
  <div class="rule"></div>
  <div class="label">vancouver &nbsp;·&nbsp; one&#8209;on&#8209;one</div>
</div>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded' }); // same-origin so font/img load cleanly
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'public/og.png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log('wrote public/og.png');
