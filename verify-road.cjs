const fs=require('fs');
let s=fs.readFileSync('index.html','utf8');
const scripts=[...s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
for(const script of scripts) new Function(script);
console.log('JavaScript syntax OK');
const pw=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await pw.chromium.launch({headless:true,channel:"msedge"});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
 await page.waitForTimeout(1500);
 const results=[];
 for(const [width,height] of [[390,844],[1400,900]]) {
  await page.setViewportSize({width,height});
  results.push(await page.evaluate(()=>{
   startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
   if(document.getElementById('curveGuide')) throw Error('Road label still visible');
   const panel=ui.trackPanel.getBoundingClientRect();
   handleInputMove(panel.left+panel.width/2,panel.top);
   if(gameState.playerY!==10 || gameState.targetPlayerY!==22) throw Error('Forward input teleports the car');
   gameState.roadDistance=4800;
   keys.ArrowUp=true;
   for(let i=0;i<90;i++) {updateGame(gameState.lastFrame+16.667);cancelAnimationFrame(gameState.gameLoop);}
   keys.ArrowUp=false;
   if(gameState.playerY>22 || gameState.playerY<21) throw Error('Forward travel limit failed');
   if(playerScale()>=1 || Math.abs(gameState.currentTilt)<1) throw Error('Perspective / lane heading missing');
   let playerChecks=0;
   for(const d of [0,1300,2400,3100,3650,4350,4800,5150,6200]) {
    gameState.roadDistance=d;
    for(const y of [8,22]) for(const x of [0,50,100]) {
     gameState.playerY=y;gameState.playerX=x;
     gameState.currentTilt=clamp(playerRoadAngle(),-48,48);
     constrainPlayer();renderPlayer();
     const pr=ui.playerCar.getBoundingClientRect();
     for(let i=0;i<=8;i++) {
      const r=roadFrame(((pr.top+pr.height*i/8-panel.top)/panel.height-.35)/.65);
      if(pr.left<panel.left+r.left*panel.width/100-1 || pr.right>panel.left+r.right*panel.width/100+1) throw Error('Player outside road');
      if(pr.top<panel.top+panel.height*.35) throw Error('Player above road');
      playerChecks++;
     }
    }
   }
   gameState.playerX=50;gameState.playerY=10;
   let checks=0, maxJump=0;
   extendRoad(14000);
   for(const seg of [...roadPath.segments]) {
     const a=sampleRoad(seg.end-0.001),b=sampleRoad(seg.end+0.001);
     maxJump=Math.max(maxJump,Math.hypot(a.x-b.x,a.z-b.z));
   }
   for(let d=0;d<13000;d+=83) {
    gameState.roadDistance=d;
    for(let i=0;i<=20;i++) {
     const r=roadFrame(i/20);
     if(!Number.isFinite(r.center)||r.left<0||r.right>100) throw Error('Road outside screen');
     for(const lane of LANES) {const x=laneXOnRoad(lane,i/20);if(x<r.left||x>r.right)throw Error('Lane outside road');checks++;}
    }
   }
   gameState.roadDistance=3650;
   spawnWord('chocolate ice cream',80);
   spawnTraffic(20);spawnRock();
   const word=ui.gameEntities.querySelector('[data-type=word]');
   word.dataset.distance=gameState.roadDistance+150;
   updateEntities();applyRoadVisuals();constrainPlayer();
   const wr=word.getBoundingClientRect(),tr=ui.trackPanel.getBoundingClientRect();
   for(let i=0;i<=10;i++) {
    const y=wr.top+(wr.height*i/10)-tr.top;
    const r=roadFrame((y/tr.height-.35)/.65);
    if(wr.left<tr.left+r.left*tr.width/100-1 || wr.right>tr.left+r.right*tr.width/100+1) throw Error('Word crosses road boundary');
   }
   const before=gameState.playerX;gameState.lastFrame=1000;updateRoad(1016.667);
   if(gameState.playerX===before) throw Error('No cornering inertia');
   startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
   if(sampleRoad(0).x!==0)throw Error('Restart did not reset route');
   return {width:innerWidth,checks,playerChecks,maxJoinGap:maxJump};
  }));
 }
 await page.evaluate(()=>{gameState.roadDistance=4800;gameState.currentTilt=playerRoadAngle();constrainPlayer();renderPlayer();applyRoadVisuals();});
 await page.screenshot({path:'road-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{gameState.roadDistance=4800;applyRoadVisuals();constrainPlayer();ui.playerCar.style.left=gameState.playerX+'%';});
 await page.screenshot({path:'road-mobile.png'});
 console.log(JSON.stringify({results,errors}));
 await browser.close();
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});

