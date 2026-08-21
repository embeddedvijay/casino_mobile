import React,{useEffect,useMemo,useRef,useState}from"react";
import{ArrowLeft,RotateCcw,Volume2,VolumeX}from"lucide-react";
import"./BubbleShooter.css";
import{bubbleShooterService,COLS,ROWS,newBubble}from"./bubbleShooterService.jsx";

const around=(row,col)=>{
  const odd=row%2===1;
  const points=odd?[[row,col-1],[row,col+1],[row-1,col],[row-1,col+1],[row+1,col],[row+1,col+1]]:[[row,col-1],[row,col+1],[row-1,col-1],[row-1,col],[row+1,col-1],[row+1,col]];
  return points.filter(([r,c])=>r>=0&&r<ROWS&&c>=0&&c<COLS);
};

function groupAt(board,row,col){
  const color=board[row][col]?.color;if(!color)return[];
  const queue=[[row,col]],seen=new Set([`${row}-${col}`]),group=[];
  while(queue.length){const cell=queue.shift(),[r,c]=cell;group.push(cell);around(r,c).forEach(([nr,nc])=>{const key=`${nr}-${nc}`;if(!seen.has(key)&&board[nr][nc]?.color===color){seen.add(key);queue.push([nr,nc])}})}
  return group;
}

function floatingCells(board){
  const queue=[],seen=new Set();
  board[0].forEach((item,col)=>{if(item){queue.push([0,col]);seen.add(`0-${col}`)}});
  while(queue.length){const[r,c]=queue.shift();around(r,c).forEach(([nr,nc])=>{const key=`${nr}-${nc}`;if(board[nr][nc]&&!seen.has(key)){seen.add(key);queue.push([nr,nc])}})}
  const loose=[];board.forEach((line,row)=>line.forEach((item,col)=>{if(item&&!seen.has(`${row}-${col}`))loose.push([row,col])}));return loose;
}

function landingCell(board,column){
  let row=0;while(row<ROWS&&board[row][column])row++;
  if(row>=ROWS)return null;
  return[row,column];
}

export default function BubbleShooter(){
  const[state,setState]=useState(null),[sound,setSound]=useState(true),[shooting,setShooting]=useState(null),[message,setMessage]=useState("AIM & SHOOT"),[burst,setBurst]=useState([]);
  const boardRef=useRef(null);
  const start=async(level=state?.level||1)=>{setState(await bubbleShooterService.startLevel(level));setMessage("AIM & SHOOT");setBurst([])};
  useEffect(()=>{start(1)},[]);
  const remaining=useMemo(()=>state?.board.flat().filter(Boolean).length||0,[state]);
  const progress=Math.min(100,((state?.score||0)/(state?.target||1))*100);

  const shoot=(event)=>{
    if(!state||shooting||state.score>=state.target)return;
    const rect=boardRef.current.getBoundingClientRect();
    const x=Math.max(0,Math.min(rect.width,event.clientX-rect.left));
    const column=Math.min(COLS-1,Math.floor(x/(rect.width/COLS)));
    const target=landingCell(state.board,column);
    if(!target){setMessage("COLUMN FULL");return;}
    const[row,col]=target;
    setShooting({row,col,x:(col+.5)*(100/COLS)+(row%2?4.4:0),y:(row+.5)*(100/ROWS),color:state.current.color});
    setTimeout(()=>resolveShot(row,col),260);
  };

  const resolveShot=(row,col)=>{
    setState(old=>{
      let board=old.board.map(line=>[...line]);board[row][col]=old.current;
      const matched=groupAt(board,row,col);let removed=[];
      if(matched.length>=3){removed=[...matched];matched.forEach(([r,c])=>board[r][c]=null);const loose=floatingCells(board);loose.forEach(([r,c])=>board[r][c]=null);removed.push(...loose);}
      const misses=removed.length?0:old.misses+1;
      if(removed.length)setBurst(removed.map(([r,c])=>`${r}-${c}`));
      let nextBoard=board;
      if(misses>=5){nextBoard=[Array.from({length:COLS},()=>newBubble()),...board.slice(0,ROWS-1)];setMessage("NEW ROW!");}else setMessage(removed.length>=6?"SUPER POP!":removed.length?`+${removed.length*25}`:"MISS");
      const next={...old,board:nextBoard,score:old.score+removed.length*25,misses:misses>=5?0:misses,current:old.next,next:newBubble()};bubbleShooterService.saveProgress(next);return next;
    });
    if(sound&&navigator.vibrate)navigator.vibrate(18);setShooting(null);setTimeout(()=>setBurst([]),220);
  };

  if(!state)return null;
  const won=state.score>=state.target,gameOver=state.board[ROWS-1].some(Boolean);
  return <main className="bs-page">
    <header className="bs-header"><button onClick={()=>window.history.back()}><ArrowLeft/></button><div><small>FREE ARCADE</small><strong>BUBBLE <em>POP</em></strong></div><button onClick={()=>setSound(v=>!v)}>{sound?<Volume2/>:<VolumeX/>}</button></header>
    <section className="bs-stats"><div><small>LEVEL</small><b>{state.level}</b></div><div><small>SCORE</small><strong>{state.score.toLocaleString()}</strong></div><div><small>LEFT</small><b>{remaining}</b></div></section>
    <section className="bs-target"><span>Target {state.target.toLocaleString()}</span><b>{Math.round(progress)}%</b><div><i style={{width:`${progress}%`}}/></div></section>
    <section className="bs-stage">
      <div className="bs-ceiling"/>
      <div className="bs-board" ref={boardRef} onPointerDown={shoot}>{state.board.map((line,row)=>line.map((item,col)=><span key={`${row}-${col}`} className={`bs-slot ${row%2?"offset":""}`} style={{"--row":row,"--col":col}}>{item&&<i className={`bs-bubble ${item.color} ${burst.includes(`${row}-${col}`)?"burst":""}`}><u/></i>}</span>))}{shooting&&<i className={`bs-projectile bs-bubble ${shooting.color}`} style={{"--target-x":`${shooting.x}%`,"--target-y":`${shooting.y}%`}}><u/></i>}</div>
      <div className="bs-message">{message}</div>
      <div className="bs-aim"><span/><i/><span/></div>
      <div className={`bs-cannon ${state.current.color}`}><i className={`bs-bubble ${state.current.color}`}><u/></i></div>
      <div className="bs-next"><small>NEXT</small><i className={`bs-bubble ${state.next.color}`}><u/></i></div>
      <div className="bs-misses">{Array.from({length:5},(_,i)=><i key={i} className={i<state.misses?"used":""}/>)}</div>
      {(won||gameOver)&&<div className="bs-result"><small>{won?"LEVEL CLEARED":"BUBBLES REACHED THE LINE"}</small><h2>{won?"AWESOME!":"GAME OVER"}</h2><p>Score {state.score.toLocaleString()}</p><button onClick={()=>start(won?state.level+1:state.level)}>{won?"NEXT LEVEL":"TRY AGAIN"}</button></div>}
    </section>
    <section className="bs-footer"><div><strong>HOW TO PLAY</strong><small>Tap a column • Match 3 colors</small></div><button onClick={()=>start()}><RotateCcw/> RESTART</button></section>
  </main>;
}
