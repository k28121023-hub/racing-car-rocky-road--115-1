const {chromium}=require('C:/Users/yourf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto('file:///'+process.cwd().replaceAll('\\','/')+'/index.html');
console.log(await page.evaluate(()=>{
startGame();cancelAnimationFrame(gameState.gameLoop);clearInterval(gameState.spawnerLoop);
gameState.mistakes=1;
const score=gameState.correctCount,question=gameState.currentIdx,lastHit=gameState.lastHitTime;
const wrong=document.createElement('div');wrong.dataset.type='word';wrong.innerText='__wrong__';ui.gameEntities.appendChild(wrong);handleCollision(wrong);
if(gameState.mistakes!==1||gameState.correctCount!==score||gameState.currentIdx!==question||gameState.lastHitTime!==lastHit)throw Error('Wrong answer changed health or progress');
for(const angle of [-48,-25,0,25,48]){
 gameState.currentTilt=angle;renderPlayer();
 const a=carHitbox(ui.playerCar,playerScale(),angle);
 const headOn={...a,axes:[{x:1,y:0},{x:0,y:1}]};
 if(!carBodiesOverlap(a,headOn))throw Error('Direct hit missed at '+angle);
 // Shift along the car's narrow axis: rotated bounding rectangles may overlap,
 // but the actual body cores are separated.
 const gap=2*a.halfWidth+1;
 const beside={...a,x:a.x+a.axes[0].x*gap,y:a.y+a.axes[0].y*gap};
 if(carBodiesOverlap(a,beside))throw Error('Rotated near miss at '+angle);
 const touching={...a,x:a.x+a.axes[0].x*(a.halfWidth*.5),y:a.y+a.axes[0].y*(a.halfWidth*.5)};
 if(!carBodiesOverlap(a,touching))throw Error('Body overlap missed');
}
const rock=document.createElement('div');rock.className='game-object rock-obstacle';
rock.innerHTML='<span class="rock-body"></span><span class="rock-shadow"></span>';
ui.gameEntities.appendChild(rock);
const core=rockHitbox(rock,1);
if(core.halfWidth>=rock.offsetWidth*.25)throw Error('Rock core too wide');
for(const angle of [-48,0,48]){
gameState.currentTilt=angle;renderPlayer();
const player=carHitbox(ui.playerCar,playerScale(),angle);
const hit={...core,x:player.x,y:player.y};
if(!carBodiesOverlap(player,hit))throw Error('Rock direct hit missed');
const offset=player.halfWidth+core.halfWidth*(Math.abs(player.axes[0].x)+Math.abs(player.axes[0].y))+1;
const miss={...core,x:player.x+player.axes[0].x*offset,y:player.y+player.axes[0].y*offset};
if(carBodiesOverlap(player,miss))throw Error('Rock near miss counted');
}
rock.remove();
const car=document.createElement('div');car.dataset.type='car';gameState.lastHitTime=0;handleCollision(car);
if(gameState.mistakes!==2)throw Error('Car damage failed');
const word=document.createElement('div');word.dataset.type='word';word.innerText=gameState.queue[gameState.currentIdx].en;ui.gameEntities.appendChild(word);handleCollision(word);
if(gameState.correctCount!==score+1||gameState.currentIdx!==question+1)throw Error('Correct answer failed');
return 'PASS: wrong answer preserves health/score/question, near miss allowed, direct collision damages, correct answer scores';
}));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
