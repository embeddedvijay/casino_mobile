import React from "react";
import MobileAviator from "./games/aviator/MobileAviator.jsx";
import MobileDragonTiger from "./games/dragon-tiger/MobileDragonTiger.jsx";
import MobileLuckyRace from "./games/car-roulet/MobileLuckyRace.jsx";
import MobileMatkaDashboard from "./games/matka/MobileMatkaDashboard.jsx";
import MobileMarketInput from "./games/matka/MobileMarketInput.jsx";
import MobileLoginPage from "./pages/MobileLoginPage.jsx";
import MobileCreateAccount from "./pages/MobileCreateAccount.jsx";
import MobileForgotPassword from "./pages/MobileForgotPassword.jsx";
import MobileMatkaInfo from "./games/matka/MobileMatkaInfo.jsx";
import {Deposit as MobileDeposit,Withdraw as MobileWithdraw,AccountStatement as MobileAccountStatement,BetHistory as MobileBetHistory,UnsettledAmount as MobileUnsettledAmount,ProfitLoss as MobileProfitLoss,BonusReport as MobileBonusReport,WinningHistory as MobileWinningHistory,Notifications as MobileNotifications,Support as MobileSupport} from "./mobile/pages";


const lobbyGames=[
{path:"/aviator",tag:"HOT",theme:"#ff0b58",image:"/casino-assets/aviator.png",name:"AVIATOR"},
{path:"/dragon-tiger",tag:"POPULAR",theme:"#ffc400",image:"/casino-assets/dragon-tiger.png",name:"DRAGON TIGER"},
{path:"/lucky-race",tag:"NEW",theme:"#a855ff",image:"/casino-assets/lucky-race.png",name:"LUCKY RACE"},
{path:"/matka",tag:"CLASSIC",theme:"#b000ff",image:"/casino-assets/matka.png",name:"MATKA"},
];

function MobileLobby(){
return(
<div style={mStyles.page}>
<style>{`@keyframes bgZoom{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}@keyframes lightMove{0%{transform:translateX(-130%);opacity:0}35%{opacity:.35}100%{transform:translateX(130%);opacity:0}}@keyframes floatGlow{0%,100%{transform:translateY(0);opacity:.45}50%{transform:translateY(-14px);opacity:.8}}.casino-bg-anim{animation:bgZoom 18s ease-in-out infinite}.casino-light-sweep{animation:lightMove 7s linear infinite}.casino-float-glow{animation:floatGlow 4s ease-in-out infinite}`}</style>
<div style={mStyles.animatedBg} className="casino-bg-anim"/>
<div style={mStyles.overlay}/>
<div style={mStyles.lightSweep} className="casino-light-sweep"/>
<div style={mStyles.floatGlowOne} className="casino-float-glow"/>
<div style={mStyles.floatGlowTwo} className="casino-float-glow"/>
<header style={mStyles.header}>
  <div style={mStyles.logoBox}>
    <div style={mStyles.brand}><span style={mStyles.crown}>♛</span><strong>GOLD<span>365</span></strong></div>
    <p style={mStyles.brandSub}>PLAY · WIN · REPEAT</p>
  </div>
</header>
<section style={mStyles.cards}>
  {lobbyGames.map((game)=>
    <a href={`/login?redirect=${encodeURIComponent(game.path)}`} key={game.path} style={{...mStyles.card,borderColor:game.theme,boxShadow:`0 0 22px ${game.theme}66`}}>
      <div style={{...mStyles.ribbon,background:game.theme}}>{game.tag}</div>
      <div style={{...mStyles.visual,backgroundImage:`url(${game.image})`}}/>
      <button style={{...mStyles.playBtn,borderColor:game.theme,boxShadow:`0 0 14px ${game.theme}88`}}>PLAY NOW ›</button>
    </a>
  )}
</section>
<footer style={mStyles.footer}>
  <div style={mStyles.footerItem}><span>🛡️</span><strong>100% SECURE</strong></div>
  <div style={mStyles.footerItem}><span>🎧</span><strong>24/7 SUPPORT</strong></div>
  <div style={mStyles.footerItem}><span>🏆</span><strong>FAIR PLAY</strong></div>
  <div style={mStyles.footerItem}><span>🎁</span><strong>DAILY BONUS</strong></div>
</footer>
</div>
);
}

export default function App(){
const path=window.location.pathname;

if(path==="/aviator")return <MobileAviator/>;
if(path==="/dragon-tiger")return <MobileDragonTiger/>;
if(path==="/lucky-race")return <MobileLuckyRace/>;
if(path==="/matka")return <MobileMatkaDashboard/>;
if(path==="/login")return <MobileLoginPage/>;
if(path==="/create-account")return <MobileCreateAccount/>;
if(path==="/forgot-password")return <MobileForgotPassword/>;
if(path==="/matka/info")return <MobileMatkaInfo/>;

if(path==="/deposit")return <MobileDeposit/>;
if(path==="/withdraw")return <MobileWithdraw/>;
if(path==="/account-statement")return <MobileAccountStatement/>;
if(path==="/bet-history")return <MobileBetHistory/>;
if(path==="/unsettled-amount")return <MobileUnsettledAmount/>;
if(path==="/profit-loss")return <MobileProfitLoss/>;
if(path==="/bonus-report")return <MobileBonusReport/>;
if(path==="/winning-history")return <MobileWinningHistory/>;
if(path==="/notifications")return <MobileNotifications/>;
if(path==="/support")return <MobileSupport/>;


if(path.startsWith("/matka/market-input/")){
const marketName=decodeURIComponent(path.split("/matka/market-input/")[1]||"");
window.history.replaceState({marketName},"","/matka/market-input");
return <MobileMarketInput marketName={marketName}/>;
}

if(path==="/matka/market-input"){
const marketName=window.history.state?.marketName||"";
return <MobileMarketInput marketName={marketName}/>;
}
return <MobileLobby/>;

}

const mStyles={
page:{minHeight:"100vh",position:"relative",overflowY:"auto",overflowX:"hidden",color:"#fff",fontFamily:"Arial,sans-serif",padding:"18px 12px 24px",background:"#050505"},
animatedBg:{position:"fixed",inset:"-24px",backgroundImage:"url('/casino-assets/casino-bg.png')",backgroundSize:"cover",backgroundPosition:"center top",backgroundRepeat:"no-repeat",zIndex:0},
overlay:{position:"fixed",inset:0,pointerEvents:"none",zIndex:1,background:"linear-gradient(180deg,rgba(0,0,0,.10) 0%,rgba(0,0,0,.35) 42%,rgba(0,0,0,.82) 100%)"},
lightSweep:{position:"fixed",top:0,bottom:0,left:0,width:"55%",background:"linear-gradient(90deg,transparent,rgba(255,214,92,.12),transparent)",zIndex:2,pointerEvents:"none"},
floatGlowOne:{position:"fixed",left:"8%",top:"18%",width:110,height:110,borderRadius:"50%",background:"rgba(255,196,0,.17)",filter:"blur(42px)",zIndex:1},
floatGlowTwo:{position:"fixed",right:"8%",top:"30%",width:130,height:130,borderRadius:"50%",background:"rgba(176,0,255,.17)",filter:"blur(45px)",zIndex:1},
header:{position:"relative",zIndex:5,display:"flex",justifyContent:"center",alignItems:"center",padding:"4px 0 10px"},
logoBox:{textAlign:"center",background:"rgba(0,0,0,.45)",border:"1px solid rgba(255,214,92,.35)",borderRadius:16,padding:"9px 16px 7px",backdropFilter:"blur(7px)"},
brand:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:"#ffd65c",fontSize:28,fontWeight:1000,textShadow:"0 0 16px rgba(255,214,92,.7)",lineHeight:1},
crown:{fontSize:32},
brandSub:{margin:"5px 0 0",color:"#f7d36a",letterSpacing:3,fontWeight:700,fontSize:10},
cards:{position:"relative",zIndex:5,display:"grid",gridTemplateColumns:"1fr",gap:16,marginTop:10},
card:{position:"relative",minHeight:300,border:"2px solid",borderRadius:22,overflow:"hidden",padding:13,textDecoration:"none",color:"#fff",background:"linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,.55))",backdropFilter:"blur(4px)"},
ribbon:{position:"absolute",top:18,left:-43,transform:"rotate(-45deg)",width:150,textAlign:"center",padding:"7px 0",fontWeight:1000,fontSize:13,zIndex:3},
visual:{height:200,width:"100%",borderRadius:17,backgroundSize:"100% 100%",backgroundPosition:"center",backgroundRepeat:"no-repeat",boxShadow:"inset 0 -45px 70px rgba(0,0,0,.48)",marginBottom:12},
playBtn:{position:"absolute",left:20,right:20,bottom:18,height:50,borderRadius:16,border:"2px solid",background:"rgba(0,0,0,.55)",color:"#fff",fontSize:18,fontWeight:1000,cursor:"pointer"},
footer:{position:"relative",zIndex:5,margin:"18px auto 0",minHeight:72,borderRadius:18,background:"rgba(0,0,0,.56)",border:"1px solid rgba(255,255,255,.16)",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,alignItems:"center",padding:"12px",backdropFilter:"blur(8px)"},
footerItem:{display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:"#fff",fontSize:12}
};