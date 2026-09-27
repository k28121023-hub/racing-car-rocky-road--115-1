const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage();
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
console.log(await page.evaluate(()=>{
startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
function wrong(){const el=document.createElement('div');el.dataset.type='word';el.innerText='__wrong__';ui.gameEntities.appendChild(el);handleCollision(el);return el;}
for(let idx=0;idx<gameState.queue.length;idx++){
gameState.currentIdx=idx;showNextQuestion();
if(ui.feedback.innerText.includes('扣一格'))throw Error('Obsolete warning');
const el=wrong();handleCollision(el);wrong();
if(gameState.mistakes!==0||gameState.currentIdx!==idx||gameState.correctCount!==0)throw Error('Wrong answer altered state at '+idx);
}
return 'PASS: all 24 questions, including final five, preserve health and question on wrong answers';

}));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
