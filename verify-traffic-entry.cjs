const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
const results=[];
for(const [width,height] of [[390,844],[1400,900]]){
await page.setViewportSize({width,height});
for(const correct of [0,20]){
await page.evaluate(correct=>{
resizeGame();startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
gameState.correctCount=correct;Math.random=()=>.5;
spawnTraffic(20);
// Change the camera pitch during the delayed spawn.
gameState.roadDistance=500;
},correct);
await page.waitForFunction(()=>ui.gameEntities.querySelector('[data-type=car]'));
results.push(await page.evaluate(()=>{
const car=ui.gameEntities.querySelector('[data-type=car]');car.dataset.hit='true';
if(Number(car.dataset.distance)-gameState.roadDistance<ROAD_VIEW)throw Error('Spawn inside view');
const initialSpeed=Number(car.dataset.currentTrafficSpeed);
let first=null,lastWidth=0,maxAlphaStep=0,lastAlpha=0,seconds=0;
for(let i=1;i<600;i++){
gameState.lastFrame=0;updateRoad(1000/60);updateEntities();
const p=1-(Number(car.dataset.distance)-gameState.roadDistance)/ROAD_VIEW;
const alpha=Number(car.style.opacity);
if(p<0&&alpha!==0)throw Error('Visible before horizon');
if(alpha>0&&first===null){first=p;if(p>.025)throw Error('Popped into middle');}
maxAlphaStep=Math.max(maxAlphaStep,alpha-lastAlpha);lastAlpha=alpha;
if(alpha>0){
 const matrix=new DOMMatrix(getComputedStyle(car).transform);
 const w=Math.hypot(matrix.a,matrix.b);
 if(w<lastWidth-.02)throw Error('Car shrinks while approaching');
 lastWidth=w;
}
if(p>=.78){seconds=i/60;break;}
}
if(first===null||!seconds||maxAlphaStep>.1)throw Error('Reveal not smooth');
if(Number(car.dataset.currentTrafficSpeed)!==initialSpeed)throw Error('Unexpected acceleration');
return {width:innerWidth,correct:gameState.correctCount,firstVisibleProgress:first,approachSeconds:seconds,maxAlphaStep};
}));
}
}
for(let i=0;i<results.length;i+=2) if(results[i].approachSeconds!==results[i+1].approachSeconds)throw Error('Score changed approach speed');
console.log(results);
if(errors.length)throw Error(errors.join('\n'));
await page.screenshot({path:'traffic-approach.png'});
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
