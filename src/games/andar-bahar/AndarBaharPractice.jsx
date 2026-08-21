import React,{useEffect,useState} from "react";
import {ArrowLeft,RotateCcw,Volume2} from "lucide-react";
import {dealNextCard,finishRound,newRound,playRound} from "./andarBaharService.jsx";
import "./AndarBaharPractice.css";
import "./AndarBaharAnimation.css";

const Card=({card,small=false})=>card?<div className={`ab-card ${card.red?"red":""} ${small?"small":""}`}><b>{card.rank}</b><i>{card.suit}</i><span>{card.suit}</span></div>:null;

export default function AndarBaharPractice(){
  const [game,setGame]=useState(()=>newRound());
  useEffect(()=>{
    if(game.phase!=="dealing")return;
    const complete=game.dealIndex>=game.deals.length;
    const timer=setTimeout(()=>setGame(current=>complete?finishRound(current):dealNextCard(current)),complete?550:420);
    return()=>clearTimeout(timer);
  },[game.phase,game.dealIndex,game.deals?.length]);
  const setBet=(bet)=>game.phase==="choose"&&setGame({...game,bet});
  const choose=(side)=>setGame(playRound(game,side));
  const dealAgain=()=>setGame(newRound(game.balance,game.history));
  const reset=()=>setGame(newRound());
  return <main className="ab-page">
    <header className="ab-header"><button onClick={()=>history.back()}><ArrowLeft/></button><div><small>FREE PRACTICE</small><strong>ANDAR <em>BAHAR</em></strong></div><button><Volume2/></button></header>
    <section className="ab-wallet"><div><small>PRACTICE COINS</small><b>◆ {game.balance}</b></div><div><small>BET</small><b>◆ {game.bet}</b></div><button onClick={reset}><RotateCcw/> RESET</button></section>
    <section className="ab-table">
      <div className="ab-light one"/><div className="ab-light two"/>
      <div className="ab-title"><span>JOKER CARD</span><Card card={game.joker}/><small>Match the rank</small></div>
      <div className={`ab-lane andar ${game.winner==="andar"?"winner":""}`}><h2>ANDAR</h2><div className="ab-stack">{game.andar.map((card,i)=><Card key={card.id} card={card} small/>)}</div><b>{game.andar.length} CARDS</b></div>
      <div className={`ab-lane bahar ${game.winner==="bahar"?"winner":""}`}><h2>BAHAR</h2><div className="ab-stack">{game.bahar.map((card,i)=><Card key={card.id} card={card} small/>)}</div><b>{game.bahar.length} CARDS</b></div>
      {game.phase==="choose"?<div className="ab-status"><small>PLACE YOUR CHOICE</small><strong>कहाँ आएगा matching card?</strong></div>:game.phase==="dealing"?<div className="ab-status dealing"><small>DEALING CARDS</small><strong>{game.dealIndex} / {game.deals.length}</strong><i/></div>:<div className="ab-result"><small>ROUND RESULT</small><strong>{game.winner.toUpperCase()} WINS</strong><p>{game.message}</p><button onClick={dealAgain}>DEAL AGAIN</button></div>}
    </section>
    <section className="ab-bets">
      <button className="andar" disabled={game.phase!=="choose"} onClick={()=>choose("andar")}><small>BET ON</small><strong>ANDAR</strong><span>1 : 1</span></button>
      <button className="bahar" disabled={game.phase!=="choose"} onClick={()=>choose("bahar")}><small>BET ON</small><strong>BAHAR</strong><span>1 : 1</span></button>
    </section>
    <section className="ab-chips">{[10,20,50,100].map(v=><button key={v} className={game.bet===v?"active":""} onClick={()=>setBet(v)}>◆ {v}</button>)}</section>
    <section className="ab-history"><span>RECENT</span>{game.history.length?game.history.map((x,i)=><i key={i} className={x.won?"win":""}>{x.winner.toUpperCase()} {x.won?"+":"-"}{x.bet}</i>):<small>No rounds yet</small>}</section>
  </main>;
}
