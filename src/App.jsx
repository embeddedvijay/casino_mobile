import React from "react";
import MobileAviator from "./games/aviator/MobileAviator.jsx";
import MobileDragonTiger from "./games/dragon-tiger/MobileDragonTiger.jsx";
import MobileLuckyRace from "./games/car-roulet/MobileLuckyRace.jsx";
import BubbleShooter from "./games/bubble-shooter/BubbleShooter.jsx";
import TeenPattiPractice from "./games/teen-patti/TeenPattiPractice.jsx";
import AndarBaharPractice from "./games/andar-bahar/AndarBaharPractice.jsx";
import MobileMatkaDashboard from "./games/matka/MobileMatkaDashboard.jsx";
import MobileMarketInput from "./games/matka/MobileMarketInput.jsx";
import MobileLoginPage from "./pages/MobileLoginPage.jsx";
import MobileCreateAccount from "./pages/MobileCreateAccount.jsx";
import MobileForgotPassword from "./pages/MobileForgotPassword.jsx";
import MobileLobby from "./pages/MobileLobby.jsx";
import MobileMatkaInfo from "./games/matka/MobileMatkaInfo.jsx";
import {Deposit as MobileDeposit,Withdraw as MobileWithdraw,AccountStatement as MobileAccountStatement,BetHistory as MobileBetHistory,UnsettledAmount as MobileUnsettledAmount,ProfitLoss as MobileProfitLoss,BonusReport as MobileBonusReport,WinningHistory as MobileWinningHistory,Notifications as MobileNotifications,Support as MobileSupport} from "./mobile/pages";


export default function App(){
const path=window.location.pathname;

if(path==="/aviator")return <MobileAviator/>;
if(path==="/dragon-tiger")return <MobileDragonTiger/>;
if(path==="/lucky-race")return <MobileLuckyRace/>;
if(path==="/bubble-shooter")return <BubbleShooter/>;
if(path==="/teen-patti-practice")return <TeenPattiPractice/>;
if(path==="/andar-bahar-practice")return <AndarBaharPractice/>;
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
