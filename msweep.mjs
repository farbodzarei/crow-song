import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-prefers-reduced-motion']});
const p=await b.newPage();
await p.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
await p.goto('http://localhost:5191/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1800));
// overflow check
const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,over:document.documentElement.scrollWidth>document.documentElement.clientWidth+1}));
const total=await p.evaluate(()=>document.body.scrollHeight);
let i=0;
for(let y=0;y<total;y+=760){await p.evaluate(v=>window.scrollTo(0,v),y);await new Promise(r=>setTimeout(r,500));await p.screenshot({path:`/tmp/ms_${String(i).padStart(2,'0')}.png`});i++;}
console.log('frames',i,'overflow',JSON.stringify(ov),'height',total);
await b.close();
