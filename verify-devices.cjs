const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
 const page=await browser.newPage({hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
 const results=[];
 for(const [width,height] of [[320,568],[390,844],[844,390],[667,375],[768,1024],[1024,768],[820,1180],[1180,820],[1366,768],[1920,1080]]){
 await page.setViewportSize({width,height}); await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await page.evaluate(()=>{endGame(false);});
 const result=await page.evaluate(()=>{
 const button=document.querySelector('#resultScreen button').getBoundingClientRect();
 const track=ui.trackPanel.getBoundingClientRect();
 const dash=document.querySelector('.dashboard-panel').getBoundingClientRect();
 if(button.height<44||button.bottom>innerHeight+1||button.top<dash.top||button.right>innerWidth+1)throw Error('Restart outside viewport');
 if(track.bottom>innerHeight+1)throw Error('Track exceeds viewport'); if(track.height<180||track.width<200)throw Error('Track too small');
 if(document.documentElement.scrollWidth>innerWidth)throw Error('Horizontal overflow');
 startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
 return {width:innerWidth,height:innerHeight,track:[Math.round(track.width),Math.round(track.height)]};
 });
 await page.keyboard.down('ArrowLeft');
 await page.evaluate(()=>{if(!keys.ArrowLeft)throw Error('Keyboard failed');window.dispatchEvent(new Event('blur'));if(keys.ArrowLeft)throw Error('Stuck key');});
 await page.keyboard.up('ArrowLeft');
 const rect=await page.locator('#trackPanel').boundingBox();
 await page.touchscreen.tap(rect.x+rect.width*.65,rect.y+rect.height*.8);
 await page.evaluate(()=>{if(activePointer!==null)throw Error('Pointer not released');if(!Number.isFinite(gameState.playerX))throw Error('Invalid touch position');});
 results.push(result);
 }
 await page.setViewportSize({width:844,height:390});
 await page.screenshot({path:'responsive-landscape.png'});
 console.log(JSON.stringify({results,errors}));
 if(errors.length)throw Error(errors.join('\n'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

