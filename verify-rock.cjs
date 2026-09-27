const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage();
 await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
 for(const [width,height] of [[390,844],[844,390],[1400,900]]){
 await page.setViewportSize({width,height});
 await page.evaluate(()=>{resizeGame();startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);spawnRock();});
 await page.waitForTimeout(1100);
 console.log(await page.evaluate(()=>{
 const rock=ui.gameEntities.querySelector('[data-type=rock]');
 if(!rock)throw Error('Missing rock');
 rock.dataset.hit='true'; const distance=Number(rock.dataset.distance);
 const stages=[];
 for(const age of [0,0.36,0.72,0.90,1.32,2]){
 rock.dataset.age=age;gameState.frameStep=0;updateEntities();
 stages.push({age,lane:Number(rock.dataset.baseLane),height:Number(rock.dataset.height)});
 }
 if(stages[0].lane>=0&&stages[0].lane<=100)throw Error('Must start outside road');
 if(stages[1].height>=stages[0].height||stages[2].height!==0||stages[3].height<=0||stages[4].height!==0)throw Error('Fall/bounce failed');
 if(Number(rock.dataset.distance)!==distance)throw Error('Ground sliding');
 gameState.roadDistance=distance-ROAD_VIEW*.15;updateEntities();
 const r=rock.getBoundingClientRect(),p=ui.trackPanel.getBoundingClientRect();
 const frame=roadFrame(.85);
 if(r.left<p.left+frame.left*p.width/100||r.right>p.left+frame.right*p.width/100)throw Error('Rock outside road');
 if(r.width>45||r.width<20)throw Error('Rock size');
 return {width:innerWidth,rockWidth:r.width,stages};
 }));
 }
 await page.screenshot({path:'rock-landing.png'});
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

