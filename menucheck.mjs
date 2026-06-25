import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-prefers-reduced-motion']});
const p=await b.newPage();
// iPhone-ish with a smaller usable height to mimic Safari chrome
await p.setViewport({width:390,height:740,deviceScaleFactor:1,isMobile:true,hasTouch:true});
await p.goto('http://localhost:5191/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1500));
// open the hamburger
await p.evaluate(()=>{const burger=document.querySelector('button[aria-controls="mobile-menu"]');if(burger)burger.click();});
await new Promise(r=>setTimeout(r,700));
await p.screenshot({path:'/tmp/cs_menu_open.png'});
// is the book button fully within viewport?
const info=await p.evaluate(()=>{const book=[...document.querySelectorAll('#mobile-menu a')].find(a=>/book/i.test(a.textContent));if(!book)return{found:false};const r=book.getBoundingClientRect();return{found:true,bottom:Math.round(r.bottom),vh:window.innerHeight,fullyVisible:r.bottom<=window.innerHeight,aboutVisible:(()=>{const ab=[...document.querySelectorAll('#mobile-menu a')].find(a=>a.textContent.trim()==='about');const rr=ab.getBoundingClientRect();return rr.top>=0&&rr.bottom<=window.innerHeight;})()};});
console.log(JSON.stringify(info));
await b.close();
