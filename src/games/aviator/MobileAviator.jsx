import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./Mobileaviator.css";
import UserMenuLayout from "../../shared/UserMenuLayout";
import{fetchCurrentUser}from"../../shared/userSession";
import {ArrowLeft, ChevronDown, History, Menu, ShieldCheck, Users, Volume2, Wifi} from "lucide-react";


// const API = "http://localhost:8005";
// const WS = "ws://localhost:8005/ws/game";

import { API_BASE, websocketUrl } from "../../config.js";
const API=API_BASE;
const WS=websocketUrl("/ws/game");

function formatMoney(n) {
  return Number(n || 0).toFixed(2);
}

function historyClass(v) {
  if (v >= 10) return "pill pink";
  if (v >= 2) return "pill purple";
  return "pill blue";
}

function Plane({ phase, multiplier }) {
  const isBetting = phase === "betting";
  const isFlying = phase === "flying";
  const crashed = phase === "crashed";

  const safeMultiplier=Math.max(1,Number(multiplier||1));
  const progress=isFlying?Math.min(1,1-Math.exp(-(safeMultiplier-1)*0.58)):0;
  const lerp=(a,b,t)=>a+(b-a)*t;
  /*
   * The curve uses one fixed 1000x420 coordinate system on every phone.
   * Keep the final X at 620 because the plane itself occupies about 34%
   * of the canvas width; a 780 endpoint pushed its nose outside the stage.
   */
  const p0={x:35,y:360};
  const p1={x:240,y:360};
  const p2={x:500,y:220};
  const p3={x:620,y:105};
  const q0={x:lerp(p0.x,p1.x,progress),y:lerp(p0.y,p1.y,progress)};
  const q1={x:lerp(p1.x,p2.x,progress),y:lerp(p1.y,p2.y,progress)};
  const q2={x:lerp(p2.x,p3.x,progress),y:lerp(p2.y,p3.y,progress)};
  const r0={x:lerp(q0.x,q1.x,progress),y:lerp(q0.y,q1.y,progress)};
  const r1={x:lerp(q1.x,q2.x,progress),y:lerp(q1.y,q2.y,progress)};
  const end={x:lerp(r0.x,r1.x,progress),y:lerp(r0.y,r1.y,progress)};
  const clamp=(min,value,max)=>Math.max(min,Math.min(value,max));
  let planeLeft=isFlying?clamp(6,end.x/11.5,53):6;
  let planeBottom=isFlying?clamp(7,(420-end.y)/4.8,60):7;

  if (crashed) {
    /* Keep the final crash frame visible inside every screen size. */
    planeLeft=53;
    planeBottom=60;
  }

  const curve=`M ${p0.x} ${p0.y} C ${q0.x} ${q0.y}, ${r0.x} ${r0.y}, ${end.x} ${end.y}`;
  const area=`${curve} L ${end.x} 420 L ${p0.x} 420 Z`;

  return (
    <>
      {isFlying && (
        <svg
          className="flight-line-svg"
          viewBox="0 0 1000 420"
          preserveAspectRatio="none"
        >
          <defs><linearGradient id="flightFillMobile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6003d" stopOpacity=".3"/><stop offset="1" stopColor="#e6003d" stopOpacity="0"/></linearGradient></defs>
          <path d={area} fill="url(#flightFillMobile)"/>
          <path className="flight-line" d={curve} fill="none" stroke="#e6003d" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
        </svg>
      )}

      <div
        className={`plane-wrap ${isBetting ? "idle return-home" : ""} ${
          isFlying ? "flying" : ""
        } ${crashed ? "flew-away" : ""}`}
        style={{
          left: `${planeLeft}%`,
          bottom: `${planeBottom}%`,
        }}
      >
        <img
          className="aviator-plane-image"
          src="/casino-assets/aviator-plane.png"
          alt=""
          draggable="false"
        />

        <div className="plane-smoke smoke-one" />
        <div className="plane-smoke smoke-two" />
        <div className="plane-smoke smoke-three" />
      </div>
    </>
  );
}

function BetPanel({ seat, phase, multiplier, roundId, myBets, onNotice, userId }) {
  const [amount, setAmount] = useState(50);
  const [auto, setAuto] = useState(false);

  const activeBet = myBets.find((b) => b.seat === seat && b.round_id === roundId);
  const canBet = phase === "betting" && !activeBet;
  const canCashout = phase === "flying" && activeBet?.status === "active";

  async function placeBet() {
    const betAmount=Number(amount);
    if(!Number.isFinite(betAmount)||betAmount<10){
      onNotice("Minimum bet is ₹10");
      return;
    }
    try {
      const res = await fetch(`${API}/api/games/aviator/bet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId || "demo_user",
          seat,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if(!res.ok)throw new Error(data.detail||data.message||"Bet failed");
      onNotice(data.message || "Bet accepted");
    } catch(error) {
      onNotice(error.message||"Backend not connected");
    }
  }

  async function cashout() {
    try {
      const res = await fetch(`${API}/api/games/aviator/cashout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId || "demo_user",
          seat,
        }),
      });

      const data = await res.json();
      if(!res.ok)throw new Error(data.detail||data.message||"Cashout failed");
      onNotice(data.message || "Cashed out successfully");
    } catch(error) {
      onNotice(error.message||"Backend not connected");
    }
  }

  return (
    <div className={`bet-panel seat-${seat}`}>
      <div className="panel-label"><span>BET {seat}</span><i>{activeBet?.status||"READY"}</i></div>
      <div className="tab-switch">
        <button className={!auto ? "active" : ""} onClick={() => setAuto(false)}>
          Bet
        </button>
        <button className={auto ? "active" : ""} onClick={() => setAuto(true)}>
          Auto
        </button>
      </div>

      <div className="bet-body">
        <div className="amount-box">
          <div className="amount-input">
            <button onClick={() => setAmount(Math.max(10, Number(amount || 0) - 10))}>
              −
            </button>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={() => setAmount(Number(amount || 0) + 10)}>+</button>
          </div>

          <div className="quick">
            <button onClick={() => setAmount(10)}>₹10</button>
            <button onClick={() => setAmount(50)}>₹50</button>
            <button onClick={() => setAmount(100)}>₹100</button>
            <button onClick={() => setAmount(500)}>₹500</button>
          </div>
        </div>

        {canCashout ? (
          <button className="bet-btn orange" onClick={cashout}>
            <small>CASH OUT</small>
            <span>₹{formatMoney(Number(activeBet.amount) * multiplier)}</span>
          </button>
        ) : (
          <button className="bet-btn" disabled={!canBet} onClick={placeBet}>
            <small>{canBet?"PLACE BET":phase==="betting"?"BET PLACED":"WAIT NEXT ROUND"}</small>
            <span>₹{formatMoney(amount)}</span>
          </button>
        )}
      </div>

      {activeBet && (
        <div className={`bet-status ${activeBet.status}`}>
          {activeBet.status === "cashed_out"
            ? `Cashed out ${activeBet.cashout_multiplier}x = ${formatMoney(
                activeBet.cashout_amount
              )}`
            : activeBet.status === "lost"
            ? "Lost"
            : "Bet accepted"}
        </div>
      )}
    </div>
  );
}

function App() {
  const [data, setData] = useState({
    phase: "waiting",
    multiplier: 1,
    countdown: 0,
    waiting_seconds: 30,
    round_id: "",
    history: [],
    all_bets: [],
    my_bets: [],
  });

  const [notice, setNotice] = useState("");
  const [showHistory,setShowHistory]=useState(false);
  const [betTab,setBetTab]=useState("all");
  const wsRef = useRef(null);

  useEffect(() => {
    let retry;

    function connect() {
      const ws = new WebSocket(WS);

      ws.onopen = () => {
        setNotice("Live connected");
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.data) {
          setData(msg.data);
        }
      };

      ws.onclose = () => {
        setNotice("Reconnecting...");
        retry = setTimeout(connect, 1500);
      };

      ws.onerror = () => {
        setNotice("Socket error");
      };

      wsRef.current = ws;
    }

    connect();

    return () => {
      clearTimeout(retry);
      wsRef.current?.close();
    };
  }, []);

  const totalBet = useMemo(() => {
    return data.all_bets.reduce((sum, b) => sum + Number(b.bet || 0), 0);
  }, [data.all_bets]);

  const gamePhase=data.phase==="waiting"?"betting":data.phase;
  const shownMultiplier = gamePhase === "betting" ? "WAITING" : `${Number(data.multiplier || 1).toFixed(2)}x`;
  
  const[user,setUser]=useState({user_name:"DEMO123",balance:0});

  useEffect(()=>{
    fetchCurrentUser().then(setUser);
  },[]);

  return (
    <div className="mobile-aviator app">
      <header className="top">
        <button className="back-button" onClick={()=>window.location.href="/"}><ArrowLeft size={20}/></button>
        <div className="brand"><span>Aviator</span><small>✈</small></div>
        <div className="top-tools">
          <div className="header-balance"><i>₹</i><span>{Number(user.balance||0).toFixed(2)}</span></div>
          <button><Volume2 size={16}/></button>
          <button className="menu-button"><Menu size={18}/></button>
        </div>
      </header>

      <section className="account-strip">
        <div className="connection"><i/><span>LIVE GAME</span><small>Round #{String(data.round_id||"---").slice(-6)}</small></div>
        <button className="deposit-mini" onClick={()=>window.location.href="/deposit"}>DEPOSIT</button>
      </section>

      <main className="layout">
        <section className="game-area">
          <div className="history-wrap">
            <div className="history-label"><History size={14}/><span>Previous rounds</span></div>
            <div className="history">
              {[...(data.history||[])].reverse().slice(0,100).map((v,i)=>(
                <span key={i} className={historyClass(v)}>{Number(v).toFixed(2)}x</span>
              ))}
              <button className={`drop ${showHistory?"open":""}`} onClick={()=>setShowHistory(!showHistory)}><ChevronDown size={16}/></button>
            </div>
            {showHistory&&(
              <div className="history-dropdown">
                {[...(data.history||[])].reverse().map((v,i)=>(
                  <span key={i} className={historyClass(v)}>{Number(v).toFixed(2)}x</span>
                ))}
              </div>
            )}
          </div>

            <div
              className={`canvas ${
                gamePhase === "betting" ? "waiting-mode" : ""
              } ${gamePhase === "flying" ? "flying-mode" : ""} ${
                gamePhase === "crashed" ? "crashed-mode" : ""
              } ${
                Number(data.multiplier || 1) >= 10
                  ? "hot-bg"
                  : Number(data.multiplier || 1) >= 2
                  ? "mid-bg"
                  : "low-bg"
              }`}
            >
            <div className="stage-status"><span className={gamePhase}><i/>{gamePhase==="betting"?"BETS OPEN":gamePhase==="flying"?"FLYING":"ROUND ENDED"}</span><small><Wifi size={12}/> LIVE</small></div>
            <div className="rays" />

            <div className="axis y">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i}>•</span>
              ))}
            </div>

            <div className="axis x">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <span key={i}>•</span>
              ))}
            </div>

              {gamePhase === "betting" ? (
                <div className="waiting-box">
                  <div className="loader-plane">
                    <svg viewBox="0 0 80 80">
                      <path d="M40 4 53 37 76 44 54 52 41 76 31 51 5 43 30 36z" />
                    </svg>
                    <span className="loader-ring ring-1" />
                    <span className="loader-ring ring-2" />
                    <span className="loader-ring ring-3" />
                  </div>

                  <div className="waiting-text">NEXT ROUND STARTS IN</div>
                  <div className="countdown-value">{Math.max(0,Math.ceil(Number(data.countdown||0)))}s</div>

                  <div className="timer-bar">
                    <div
                      className="timer-fill"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            (Number(data.countdown || 0) /
                              Number(data.waiting_seconds || 30)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ): gamePhase === "crashed" ? (
              <div className="crash-center">
                <div className="flew-text">FLEW AWAY!</div>
                <div className="flew-multiplier">
                  {Number(data.crashed_at || data.multiplier || 1).toFixed(2)}x
                </div>
              </div>
            ) : (
              <div className="multiplier">{shownMultiplier}</div>
            )}

            <Plane phase={gamePhase} multiplier={Number(data.multiplier || 1)} />
          </div>

          <div className="game-meta"><span><ShieldCheck size={13}/> Provably fair</span><span><Users size={13}/>{(data.all_bets||[]).length} players</span><span>Total ₹{formatMoney(totalBet)}</span></div>

          <div className="panels">
            <BetPanel
              seat={1}
              phase={gamePhase}
              multiplier={Number(data.multiplier || 1)}
              roundId={data.round_id}
              myBets={data.my_bets || []}
              onNotice={setNotice}
              userId={user.user_id||user.id||user.user_name}
            />

            <BetPanel
              seat={2}
              phase={gamePhase}
              multiplier={Number(data.multiplier || 1)}
              roundId={data.round_id}
              myBets={data.my_bets || []}
              onNotice={setNotice}
              userId={user.user_id||user.id||user.user_name}
            />
          </div>

          <section className="bets-board">
            <div className="bets-tabs">
              <button className={betTab==="all"?"active":""} onClick={()=>setBetTab("all")}>All Bets</button>
              <button className={betTab==="mine"?"active":""} onClick={()=>setBetTab("mine")}>My Bets</button>
              <button className={betTab==="top"?"active":""} onClick={()=>setBetTab("top")}>Top</button>
            </div>
            <div className="bets-summary"><span><Users size={13}/>{(data.all_bets||[]).length} players</span><strong>₹{formatMoney(totalBet)}</strong></div>
            <div className="bets-head"><span>Player</span><span>Bet INR</span><span>Multiplier</span><span>Cash out</span></div>
            <div className="bets-list">
              {(betTab==="mine"?(data.my_bets||[]):(data.all_bets||[])).slice(0,12).map((bet,index)=>{
                const player=bet.user_name||bet.username||bet.user_id||`Player ${index+1}`;
                const amount=bet.bet??bet.amount??0;
                const cashMultiplier=bet.cashout_multiplier||bet.multiplier;
                const cashAmount=bet.cashout_amount||0;
                return <div className={`bets-row ${cashAmount?"won":""}`} key={bet.id||`${player}-${index}`}>
                  <span><i>{String(player).slice(0,1).toUpperCase()}</i>{String(player).slice(0,12)}</span>
                  <span>₹{formatMoney(amount)}</span>
                  <span>{cashMultiplier?`${Number(cashMultiplier).toFixed(2)}x`:"—"}</span>
                  <strong>{cashAmount?`₹${formatMoney(cashAmount)}`:"—"}</strong>
                </div>;
              })}
              {!(betTab==="mine"?(data.my_bets||[]):(data.all_bets||[])).length&&<div className="empty-bets">No bets in this round</div>}
            </div>
            <div className="fair-row"><span><ShieldCheck size={13}/>This game is provably fair</span><UserMenuLayout/></div>
          </section>
        </section>
      </main>

      {notice&&<div className="toast"><i/>{notice}<button onClick={()=>setNotice("")}>×</button></div>}
    </div>
  );
}

export default App;