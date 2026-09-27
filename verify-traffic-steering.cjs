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
function make(){
const el=document.createElement('div');el.className='game-object car-size';
Object.assign(el.dataset,{type:'car',baseLane:'50',weavePhase:'0',weaveRate:'1.2',weaveAmplitude:'32',steerAge:'0',laneVelocity:'0',trafficTilt:'0',trafficSpeed:'45',distance:'500',hit:'true'});
ui.gameEntities.appendChild(el);return el;
}
const ends=[];
for(const hz of [30,60,120]){
const car=make();let min=100,max=0,left=false,right=false,prev=50;
for(let i=0;i<6*hz;i++){
updateTrafficSteering(car,1/hz,.5);
const lane=Number(car.dataset.baseLane),v=Number(car.dataset.laneVelocity);
if(Math.abs(lane-prev)>24/hz+.001)throw Error('Lane teleport');
if(Math.abs(Number(car.dataset.trafficTilt))>32.001)throw Error('Excessive tilt');
left ||= v< -2;right ||= v>2;min=Math.min(min,lane);max=Math.max(max,lane);prev=lane;
}
if(max-min<35||!left||!right)throw Error('Insufficient weaving');
ends.push(Number(car.dataset.baseLane));car.remove();
}
if(Math.max(...ends)-Math.min(...ends)>.02)throw Error('Frame-rate dependent steering');
const car=make();let checks=0;
for(const d of [0,500,1600,3600,4800]){
gameState.roadDistance=d;
for(const p of [.2,.55,.85])for(const lane of [16,50,84])for(const tilt of [-32,32]){
Object.assign(car.dataset,{distance:String(d+ROAD_VIEW*(1-p)),baseLane:String(lane),trafficTilt:String(tilt)});
gameState.frameStep=0;updateEntities();
const rect=car.getBoundingClientRect(),panel=ui.trackPanel.getBoundingClientRect();
for(let i=0;i<=8;i++){
const road=roadFrame(roadProgressAtY(rect.top-panel.top+rect.height*i/8));
if(rect.left<panel.left+road.left*panel.width/100-1||rect.right>panel.left+road.right*panel.width/100+1)throw Error('Tilted car outside road');
checks++;
}
}
}
return {width:innerWidth,ends,boundaryChecks:checks};
}));
}
if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
