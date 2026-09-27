const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
  console.log(await page.evaluate(()=>{
   startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
   gameState.mistakes=2;
   const star=spawnHealthStar(50);handleCollision(star);
   if(gameState.mistakes!==1 || star.isConnected)throw Error('Healing failed');
   handleCollision(star);if(gameState.mistakes!==1)throw Error('Duplicate heal');
   gameState.mistakes=0;handleCollision(spawnHealthStar(50));
   if(gameState.mistakes!==0)throw Error('Overhealed');
   gameState.mistakes=3;handleCollision(spawnHealthStar(50));
   if(gameState.mistakes!==3)throw Error('Revived after fatal hit');
   gameState.mistakes=1;
   const random=Math.random;Math.random=()=>0;
   lastRockTime=Date.now();lastHealthStarTime=Date.now()-HEALTH_STAR_COOLDOWN;
   spawnManager();
   if(ui.gameEntities.querySelectorAll('[data-type=health_star]').length!==1)throw Error('No random star');
   spawnManager();
   if(ui.gameEntities.querySelectorAll('[data-type=health_star]').length!==1)throw Error('Duplicate star spawn');
   Math.random=random;
   ui.gameEntities.innerHTML='';
   const visible=spawnHealthStar(80);
   gameState.roadDistance=4800;visible.dataset.distance=4950;
   updateEntities();
   const rect=visible.getBoundingClientRect(),panel=ui.trackPanel.getBoundingClientRect();
   for(let i=0;i<=8;i++){
    const r=roadFrame(((rect.top+rect.height*i/8-panel.top)/panel.height-.35)/.65);
    if(rect.left<panel.left+r.left*panel.width/100-1||rect.right>panel.left+r.right*panel.width/100+1)throw Error('Star off road');
   }
   return 'PASS: heal +1, full-health cap, single pickup, fatal-hit guard, random spawn, one-star limit, curved-road bounds';
  }));
  if(errors.length)throw Error(errors.join('\n'));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
