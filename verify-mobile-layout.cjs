const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
 const page=await browser.newPage({hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
 for(const [width,height] of [[320,568],[390,844],[844,390],[667,375],[768,1024],[1366,768]]) {
 await page.setViewportSize({width,height});
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(r)));
 await page.evaluate(()=>{
 startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
 gameState.frameStep=0;
 for(const distance of [0,1600,3900,5200]) for(const p of [0,.1,.3,.6,.85]) {
 gameState.roadDistance=distance;ui.gameEntities.innerHTML='';
 spawnWord('ballroom dancing club',20);spawnWord('sign language club',50);
 const words=[...ui.gameEntities.children];
 words.forEach(el=>el.dataset.distance=distance+ROAD_VIEW*(1-p));
 updateEntities();
 const [a,b]=words.map(el=>el.getBoundingClientRect());
 if(a.right>b.left+.5) throw Error('Words overlap at '+innerWidth+' / '+distance+' / '+p);
 }
 endGame(false);
 });
 for(const button of await page.locator('#resultScreen button').all()) {
 const b=await button.boundingBox();if(b.height<44||b.y<0||b.y+b.height>height)throw Error('Result action clipped');
 }
 await page.getByRole('button',{name:'退出／回到主選單'}).tap();
 if(!await page.getByRole('button',{name:'ENGINE START'}).isVisible())throw Error('Menu not restored');
 await page.getByRole('button',{name:'ENGINE START'}).tap();
 await page.evaluate(()=>{if(!gameState.isRunning)throw Error('Cannot start again');endGame(false);});
 await page.getByRole('button',{name:'RESTART',exact:true}).tap();
 await page.evaluate(()=>{if(!gameState.isRunning)throw Error('Cannot restart');endGame(true);});
 console.log('PASS',width,height);
 }
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'mobile-result-check.png'});
 if(errors.length)throw Error(errors.join('\n'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
