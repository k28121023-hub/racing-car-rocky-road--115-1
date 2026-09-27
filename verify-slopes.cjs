const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
for(const [width,height] of [[390,844],[844,390],[1400,900]]){
await page.setViewportSize({width,height});
console.log(await page.evaluate(()=>{
resizeGame();startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
let checks=0;
for(let d=0;d<6500;d+=100){
 gameState.roadDistance=d;applyRoadVisuals();
 let previous=-Infinity;
 for(let i=0;i<=100;i++){
 const p=i/100,y=roadScreenY(p);
 if(y<=previous||Math.abs(roadProgressAtY(y)-p)>1e-8)throw Error('Slope projection');
 previous=y;checks++;
 }
 for(const x of [14,50,86]){
 gameState.playerX=x;gameState.currentTilt=playerRoadAngle();constrainPlayer();renderPlayer();
 const r=ui.playerCar.getBoundingClientRect(),panel=ui.trackPanel.getBoundingClientRect();
 if(!Number.isFinite(r.left)||r.left<panel.left-1||r.right>panel.right+1)throw Error('Player bounds');
 }
}
gameState.roadDistance=500;ui.gameEntities.innerHTML='';spawnWord('test',50);
const word=ui.gameEntities.querySelector('[data-type=word]');word.dataset.distance=gameState.roadDistance+ROAD_VIEW*.3;word.dataset.hit='true';gameState.frameStep=0;updateEntities();
const r=word.getBoundingClientRect(),panel=ui.trackPanel.getBoundingClientRect();
if(Math.abs(r.bottom-panel.top-roadScreenY(.7))>1)throw Error('Word floating');
if(roadGrade(500)<=0||roadGrade(1600)>=0)throw Error('Missing climb/descent');
return {width:innerWidth,projectionChecks:checks};
}));
}
await page.evaluate(()=>{gameState.roadDistance=500;applyRoadVisuals();constrainPlayer();renderPlayer();});
await page.screenshot({path:'slope-uphill.png'});
await page.evaluate(()=>{gameState.roadDistance=1600;applyRoadVisuals();constrainPlayer();renderPlayer();});
await page.screenshot({path:'slope-downhill.png'});
if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
