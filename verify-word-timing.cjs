const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage();
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
console.log(await page.evaluate(()=>{
startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
const originalNow=Date.now,originalRandom=Math.random;
let now=lastWordTime;const begin=now;const firstDelay=wordSpawnInterval;
if(firstDelay!==10000&&firstDelay!==11000)throw Error("Invalid initial interval");
Date.now=()=>now;Math.random=()=>0.3;
try{
function count(){return ui.gameEntities.querySelectorAll('[data-type=word]').length;}
now=begin+firstDelay-1;spawnManager();if(count()!==0)throw Error('Early first word');
ui.gameEntities.innerHTML="";now=begin+firstDelay;spawnManager();if(count()!==2||lastWordTime!==now)throw Error('First word missing');
const first=ui.gameEntities.querySelector('[data-type=word]');
if(first.dataset.word!==gameState.queue[gameState.currentIdx].en)throw Error('Missing correct choice');
const choices=[...ui.gameEntities.querySelectorAll('[data-type=word]')];
if(new Set(choices.map(el=>el.dataset.word)).size!==2 || new Set(choices.map(el=>el.dataset.baseLane)).size!==2)throw Error('Wave options overlap');
ui.gameEntities.innerHTML='';
now=begin+firstDelay+9999;spawnManager();if(count()!==0)throw Error('Word cooldown bypassed');
ui.gameEntities.innerHTML="";now=begin+firstDelay+10000;spawnManager();if(count()!==2)throw Error('Next word missing');
Math.random=()=>0.9;startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
if(wordSpawnInterval!==11000)throw Error('11-second interval missing');
if(lastWordTime!==now)throw Error('Restart timer not reset');
return 'PASS: random 10/11-second intervals, no early wave, correct choice, restart resets timer';
}finally{Date.now=originalNow;Math.random=originalRandom;}
}));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
