const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
console.log(await page.evaluate(()=>{
startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
const car=document.createElement('div');car.className='game-object car-size';
car.style.cssText='left:50%;top:300px;opacity:1;z-index:2000;transform:translateX(-50%) rotate(25deg) scale(0.8)';
car.dataset.currentTrafficSpeed=90;ui.gameEntities.appendChild(car);
emitTrafficSmoke(car,.8,25,.06);
let particles=[...ui.gameEntities.querySelectorAll('.enemy-smoke')];
if(particles.length!==2)throw Error('Missing exhaust pair');
const panel=ui.trackPanel.getBoundingClientRect(),rect=car.getBoundingClientRect();
const averageY=particles.reduce((sum,p)=>sum+parseFloat(p.style.top),0)/2;
if(averageY>=(rect.top+rect.bottom)/2-panel.top)throw Error('Smoke not at rear');
if(particles.some(p=>p.classList.contains('game-object')||getComputedStyle(p).pointerEvents!=='none'))throw Error('Smoke affects interaction');
car.style.opacity='0';emitTrafficSmoke(car,.8,25,1);
if(ui.gameEntities.querySelectorAll('.enemy-smoke').length!==2)throw Error('Hidden car emits');
car.style.opacity='1';car.dataset.hit='true';emitTrafficSmoke(car,.8,25,1);
if(ui.gameEntities.querySelectorAll('.enemy-smoke').length!==2)throw Error('Crashed car emits');
car.dataset.hit='false';
for(let i=0;i<100;i++)emitTrafficSmoke(car,.8,25,.12);
if(ui.gameEntities.querySelectorAll('.enemy-smoke').length>80)throw Error('Particle limit');
return 'PASS: paired rear exhaust, rotation, no input/collision interference, hidden/crash guard, particle cap';
}));
await page.waitForTimeout(800);
if(await page.locator('.enemy-smoke').count())throw Error('Smoke not cleaned up');
console.log('PASS: smoke fades and removes itself');
if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
