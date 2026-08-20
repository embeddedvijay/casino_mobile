import React, {useState} from "react";
import {Bell, ChevronRight, CircleDollarSign, Gift, Headphones, Home, Menu, Search, ShieldCheck, Trophy, UserRound, WalletCards, Zap} from "lucide-react";
import "./MobileLobby.css";

const games=[
  {path:"/aviator",tag:"HOT",category:"Crash",image:"/casino-assets/aviator.png",name:"Aviator",accent:"#ff315c",players:"2.8K"},
  {path:"/dragon-tiger",tag:"LIVE",category:"Casino",image:"/casino-assets/dragon-tiger.png",name:"Dragon Tiger",accent:"#ffba25",players:"1.6K"},
  {path:"/lucky-race",tag:"NEW",category:"Racing",image:"/casino-assets/lucky-race.png",name:"Lucky Race",accent:"#a970ff",players:"928"},
  {path:"/matka",tag:"POPULAR",category:"Matka",image:"/casino-assets/matka.png",name:"Matka",accent:"#df4cff",players:"4.2K"}
  ,{path:"/color-ball",tag:"FREE",category:"Free",image:"/casino-assets/color-ball.svg",name:"Color Blast",accent:"#35dfff",players:"PLAY"}
];

const categories=["All Games","Free","Crash","Casino","Racing","Matka"];

export default function MobileLobby(){
  const [category,setCategory]=useState("All Games");
  const filtered=category==="All Games"?games:games.filter((game)=>game.category===category);

  const openGame=(path,category)=>{
    window.location.href=category==="Free"?path:`/login?redirect=${encodeURIComponent(path)}`;
  };

  return(
    <main className="casino-lobby">
      <div className="lobby-ambient lobby-ambient-one"/>
      <div className="lobby-ambient lobby-ambient-two"/>

      <header className="lobby-header">
        <button className="icon-button" aria-label="Open menu"><Menu size={22}/></button>
        <a className="lobby-brand" href="/">
          <span className="brand-crown">♛</span>
          <span>GOLD<strong>365</strong></span>
        </a>
        <button className="icon-button notification-button" aria-label="Notifications" onClick={()=>window.location.href="/notifications"}>
          <Bell size={20}/><i/>
        </button>
      </header>

      <section className="wallet-strip">
        <div className="wallet-copy">
          <span><WalletCards size={15}/> Main wallet</span>
          <strong>₹ 0.00</strong>
        </div>
        <div className="wallet-actions">
          <button onClick={()=>window.location.href="/deposit"}><CircleDollarSign size={17}/> Deposit</button>
          <button className="withdraw-button" onClick={()=>window.location.href="/withdraw"}>Withdraw</button>
        </div>
      </section>

      <section className="hero-banner">
        <div className="hero-glow"/>
        <div className="hero-copy">
          <span className="hero-kicker"><Zap size={13} fill="currentColor"/> Daily rewards</span>
          <h1>PLAY BIG.<br/><em>WIN BIGGER.</em></h1>
          <p>India's most exciting live gaming experience.</p>
          <button onClick={()=>openGame("/aviator")}>Play now <ChevronRight size={17}/></button>
        </div>
        <div className="hero-jackpot">
          <span>MEGA JACKPOT</span>
          <strong>₹12,48,650</strong>
          <small>Live prize pool</small>
        </div>
      </section>

      <section className="quick-benefits">
        <div><ShieldCheck/><span><strong>100%</strong> Secure</span></div>
        <div><Trophy/><span><strong>Fair</strong> Play</span></div>
        <div><Headphones/><span><strong>24/7</strong> Support</span></div>
        <div><Gift/><span><strong>Daily</strong> Bonus</span></div>
      </section>

      <section className="games-section">
        <div className="section-heading">
          <div><span className="live-dot"/><h2>Live games</h2></div>
          <button>View all <ChevronRight size={15}/></button>
        </div>
        <div className="category-tabs">
          {categories.map((item)=><button className={category===item?"active":""} key={item} onClick={()=>setCategory(item)}>{item}</button>)}
        </div>
        <div className="game-grid">
          {filtered.map((game)=><article className="game-card" key={game.path} style={{"--accent":game.accent}} onClick={()=>openGame(game.path,game.category)}>
            <div className="game-art" style={{backgroundImage:`url(${game.image})`}}>
              <span className="game-tag">{game.tag}</span>
              <span className="players"><i/>{game.players} playing</span>
              <div className="game-shade"/>
              <button aria-label={`Play ${game.name}`}><span>▶</span></button>
            </div>
            <div className="game-info">
              <div><strong>{game.name}</strong><span>{game.category} game</span></div>
              <ChevronRight size={18}/>
            </div>
          </article>)}
        </div>
      </section>

      <nav className="bottom-navigation">
        <a className="active" href="/"><Home/><span>Home</span></a>
        <a href="#games"><Search/><span>Explore</span></a>
        <a className="central-action" href="/deposit"><span><WalletCards/></span><small>Wallet</small></a>
        <a href="/bonus-report"><Gift/><span>Bonus</span></a>
        <a href="/account-statement"><UserRound/><span>Account</span></a>
      </nav>
    </main>
  );
}