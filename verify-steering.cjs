const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
 console.log(await page.evaluate(async()=>{
 startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
 const reset=()=>{gameState.playerX=50;gameState.lateralVelocity=0;gameState.targetPlayerX=null;keys.ArrowLeft=false;keys.ArrowRight=false;};
 reset();keys.ArrowRight=true;updateSteering(1/60);
 if(gameState.playerX-50>0.1||gameState.lateralVelocity<=0)throw Error('Abrupt start');
 for(let i=0;i<20;i++)updateSteering(1/60);
 const fast=gameState.lateralVelocity;keys.ArrowRight=false;updateSteering(1/60);
 if(gameState.lateralVelocity<=0||gameState.lateralVelocity>=fast)throw Error('No release easing');
 for(let i=0;i<30;i++)updateSteering(1/60);
 if(Math.abs(gameState.lateralVelocity)>0.01)throw Error('Does not stop');
 reset();keys.ArrowRight=true;for(let i=0;i<20;i++)updateSteering(1/60);
 keys.ArrowRight=false;keys.ArrowLeft=true;updateSteering(1/60);
 if(gameState.lateralVelocity<0)throw Error('Instant direction reversal');
 const positions=[];
 for(const fps of [30,60,120]){reset();keys.ArrowRight=true;for(let i=0;i<fps;i++)updateSteering(1/fps);positions.push(gameState.playerX);}
 if(Math.max(...positions)-Math.min(...positions)>0.05)throw Error('Frame dependent motion');
 reset();const panel=ui.trackPanel.getBoundingClientRect();handleInputMove(panel.right-10,panel.bottom-60);
 if(gameState.playerX!==50)throw Error('Pointer teleports');
 for(let i=0;i<180;i++)updateSteering(1/60);
 if(Math.abs(gameState.playerX-86)>0.15)throw Error('Pointer target convergence');
 spawnTraffic(20);spawnRock();
 const warnings=[...ui.gameEntities.querySelectorAll('[data-type=warning]')];
 if(warnings.length!==2||warnings.some(w=>getComputedStyle(w).display!=='none'||w.textContent.trim()))throw Error('Visible warning');
 await new Promise(resolve=>setTimeout(resolve,1100));
 if(!ui.gameEntities.querySelector('[data-type=car]')||!ui.gameEntities.querySelector('[data-type=rock]'))throw Error('Spawn removed');
 return {status:'PASS',checks:['acceleration','release braking','smooth reversal','pointer easing','30/60/120 fps','hidden warnings','car and rock spawns'],positions};
 }));
 if(errors.length)throw Error(errors.join('\n'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
