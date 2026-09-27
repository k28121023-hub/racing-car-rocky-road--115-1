const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for (const file of ['index.html','vocabulary-2.html']) {
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/'+file);
console.log(await page.evaluate(()=>{
startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
const car=document.createElement('div');car.className='game-object car-size';
Object.assign(car.dataset,{type:'car',trafficSpeed:'45',distance:'500',baseLane:'20',hit:'true'});
ui.gameEntities.appendChild(car);
const results=[];
for(const count of [0,1,12,23]){
gameState.correctCount=count;gameState.roadDistance=0;gameState.frameStep=1;
car.dataset.distance=500;car.dataset.currentTrafficSpeed=trafficSpeed(car);
updateEntities();
const moved=500-Number(car.dataset.distance);
if(Math.abs(moved-24/60)>1e-8)throw Error('Traffic should stay slow regardless of answers');
results.push({correct:count,speed:trafficSpeed(car)});
}
for(const hz of [30,60,120]){
gameState.frameStep=60/hz;car.dataset.distance=500;
for(let i=0;i<hz;i++)updateEntities();
if(Math.abs(500-Number(car.dataset.distance)-trafficSpeed(car))>1e-6)throw Error('Refresh rate mismatch');
}
gameState.frameStep=1;gameState.roadDistance=0;car.dataset.distance=500;
const normalBefore=Number(car.dataset.distance);updateEntities();
const carMovement=normalBefore-Number(car.dataset.distance);
if(!(carMovement>0))throw Error('Car stationary');
startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
if(trafficSpeed(car)!==24)throw Error('Restart did not reset difficulty');
return {results,checks:'constant slow traffic at every score, refresh rates, restart'};
}));
}
if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
