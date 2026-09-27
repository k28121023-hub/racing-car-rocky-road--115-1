const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
const page=await browser.newPage({hasTouch:true});await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
for(const [width,height] of [[320,568],[390,844],[667,375],[844,390]]){
await page.setViewportSize({width,height});await page.evaluate(()=>{startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);});
const buttons=await page.locator('#directionPad button').all();
for(const button of buttons){const b=await button.boundingBox();const track=await page.locator('#trackPanel').boundingBox();if(b.width<44||b.height<44||b.x<0||b.y<0||b.x+b.width>width||b.y+b.height>height)throw Error('Button clipped');if(b.x<track.x+track.width&&b.y<track.y+track.height)throw Error('Pad obscures road');}
await page.evaluate(()=>{
const fire=(key,type,id)=>document.querySelector(`[data-key="${key}"]`).dispatchEvent(new PointerEvent(type,{pointerId:id,button:0,bubbles:true}));
// Synthetic pointer IDs cannot be captured; stub only capture for this state test.
for(const button of document.querySelectorAll('#directionPad button'))button.setPointerCapture=()=>{};
fire('ArrowUp','pointerdown',10);fire('ArrowRight','pointerdown',11);
if(!keys.ArrowUp||!keys.ArrowRight)throw Error('Multi-touch failed');
const x=gameState.playerX;updateSteering(.25);if(gameState.playerX<=x)throw Error('No steering');
fire('ArrowUp','pointerup',10);if(keys.ArrowUp||!keys.ArrowRight)throw Error('Independent release failed');
fire('ArrowRight','pointercancel',11);if(keys.ArrowRight)throw Error('Cancel stuck');
fire('ArrowLeft','pointerdown',12);window.dispatchEvent(new Event('blur'));if(Object.values(keys).some(Boolean)||padPointers.size)throw Error('Blur stuck');
});
await page.screenshot({path:`pad-${width}.png`});console.log('PASS',width,height);
await page.evaluate(()=>endGame(false));if(await page.locator('#directionPad').isVisible())throw Error('Pad visible over result');
}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
