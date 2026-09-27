const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage({hasTouch:true,viewport:{width:390,height:844}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
console.log(await page.evaluate(()=>{
function setup(){startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);gameState.lastFrame=0;}
function step(n,start=0){for(let i=1;i<=n;i++)updateRoad((start+i)*1000/60);}
setup();step(120);const cruise=gameState.roadDistance;
setup();keys.ArrowUp=true;step(120);const fast=gameState.roadDistance;
if(fast<cruise*2.7||gameState.speedMultiplier>3)throw Error('Acceleration failed');
keys.ArrowUp=false;step(120,120);
if(gameState.speedMultiplier>1.001)throw Error('Release did not return to cruise');
activePointer=42;const rect=ui.trackPanel.getBoundingClientRect();handleInputMove(rect.left+rect.width/2,rect.top+rect.height*.5);
if(!gameState.pointerForward)throw Error('Touch acceleration missing');
resetInput();if(gameState.pointerForward)throw Error('Touch acceleration stuck');
keys.ArrowUp=true;step(60,240);startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
if(gameState.speedMultiplier!==1||keys.ArrowUp)throw Error('Restart speed failed');
function relative(mult){
gameState.roadDistance=0;gameState.frameStep=1;gameState.speedMultiplier=mult;
ui.gameEntities.innerHTML='';spawnWord('test',20);const word=ui.gameEntities.querySelector('[data-type=word]');word.dataset.hit='true';word.dataset.distance=300;
gameState.roadDistance=95*mult/60;updateEntities();return Number(word.dataset.distance)-gameState.roadDistance;
}
if(relative(3)>=relative(1))throw Error('Entities do not approach faster');
return {cruiseDistance:cruise,acceleratedDistance:fast,result:'PASS: keyboard, touch intent, release, restart, entity approach'};
}));
if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
