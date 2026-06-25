import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-prefers-reduced-motion']});
const p=await b.newPage();
await p.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
await p.goto('http://localhost:5191/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,2000));
await p.screenshot({path:'/tmp/cs_hero_now.png'});
await b.close();console.log('done');
