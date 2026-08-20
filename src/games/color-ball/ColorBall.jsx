import React,{useEffect,useMemo,useState}from"react";
import{ArrowLeft,RotateCcw,Volume2,VolumeX,Zap}from"lucide-react";
import"./ColorBall.css";
import{colorBallGameService,SIZE}from"./colorBallDemoService";

const neighbours=(row,col)=>[[row-1,col],[row+1,col],[row,col-1],[row,col+1]].filter(([r,c])=>r>=0&&c>=0&&r<SIZE&&c<SIZE);

function connected(board,startRow,startCol){
  const target=board[startRow]?.[startCol]?.color;
  if(!target)return[];
  const queue=[[startRow,startCol]],seen=new Set([`${startRow}-${startCol}`]),group=[];
  while(queue.length){
    const[row,col]=queue.shift();
    group.push([row,col]);
    neighbours(row,col).forEach(([r,c])=>{
      const key=`${r}-${c}`;
      if(!seen.has(key)&&board[r]?.[c]?.color===target){seen.add(key);queue.push([r,c]);}
    });
  }
  return group;
}

function refill(board,removed){
  const removedSet=new Set(removed.map(([r,c])=>`${r}-${c}`));
  const colors=["ruby","aqua","violet","lime","gold"];
  const next=Array.from({length:SIZE},()=>Array(SIZE).fill(null));
  for(let col=0;col<SIZE;col++){
    const kept=[];
    for(let row=SIZE-1;row>=0;row--)if(!removedSet.has(`${row}-${col}`))kept.push(board[row][col]);
    for(let row=SIZE-1,index=0;row>=0;row--,index++)next[row][col]=kept[index]||{id:`ball-${Date.now()}-${row}-${col}-${Math.random()}`,color:colors[Math.floor(Math.random()*colors.length)]};
  }
  return next;
}

export default function ColorBall(){
  const[state,setState]=useState(null);
  const[sound,setSound]=useState(true);
  const[combo,setCombo]=useState(0);
  const[burst,setBurst]=useState([]);

  const start=async(level=state?.level||1)=>setState(await colorBallGameService.startGame(level));
  useEffect(()=>{start(1)},[]);
  const progress=useMemo(()=>Math.min(100,((state?.score||0)/(state?.target||1))*100),[state]);

  const pop=(row,col)=>{
    if(!state||state.moves<=0||state.score>=state.target)return;
    const group=connected(state.board,row,col);
    if(group.length<2){setCombo(0);return;}
    const gained=group.length*group.length*10;
    setBurst(group.map(([r,c])=>`${r}-${c}`));
    if(sound&&navigator.vibrate)navigator.vibrate(group.length>=5?[18,20,25]:15);
    setTimeout(()=>{
      setState(old=>{
        const next={...old,board:refill(old.board,group),score:old.score+gained,moves:old.moves-1};
        colorBallGameService.saveProgress(next);
        return next;
      });
      setCombo(group.length);
      setBurst([]);
    },180);
  };

  if(!state)return null;
  const won=state.score>=state.target;
  const lost=!won&&state.moves<=0;
  return <main className="cb-page">
    <div className="cb-aurora one"/><div className="cb-aurora two"/>
    <header className="cb-header">
      <button onClick={()=>history.back()}><ArrowLeft/></button>
      <div><small>FREE GAME</small><strong>COLOR <em>BLAST</em></strong></div>
      <button onClick={()=>setSound(value=>!value)}>{sound?<Volume2/>:<VolumeX/>}</button>
    </header>

    <section className="cb-status">
      <div><small>LEVEL</small><b>{state.level}</b></div>
      <div className="cb-score"><small>SCORE</small><strong>{state.score.toLocaleString()}</strong></div>
      <div><small>MOVES</small><b>{state.moves}</b></div>
    </section>

    <section className="cb-mission">
      <span><Zap/> Target {state.target.toLocaleString()}</span><b>{Math.round(progress)}%</b>
      <div><i style={{width:`${progress}%`}}/></div>
    </section>

    <section className="cb-game-shell">
      <div className="cb-board">
        {state.board.map((line,row)=>line.map((ball,col)=><button key={ball.id} className={`cb-ball ${ball.color} ${burst.includes(`${row}-${col}`)?"burst":""}`} onClick={()=>pop(row,col)} aria-label={`${ball.color} ball`}><i/><span/></button>))}
      </div>
      {combo>=4&&<div className="cb-combo">COMBO <b>x{combo}</b></div>}
      {(won||lost)&&<div className="cb-result"><small>{won?"LEVEL COMPLETE":"NO MOVES LEFT"}</small><h2>{won?"BRILLIANT!":"TRY AGAIN"}</h2><p>Score {state.score.toLocaleString()}</p><button onClick={()=>start(won?state.level+1:state.level)}>{won?"NEXT LEVEL":"REPLAY"}</button></div>}
    </section>

    <section className="cb-help"><span><i className="ruby"/><i className="ruby"/><i className="ruby"/></span><div><strong>Match & blast</strong><small>Tap 2 or more connected balls</small></div><button onClick={()=>start()}><RotateCcw/></button></section>
  </main>;
}