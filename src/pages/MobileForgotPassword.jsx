import React,{useState}from"react";
import{ArrowLeft,ArrowRight,Headphones,ShieldCheck,Smartphone,UserRound}from"lucide-react";
import"./MobileForgotPassword.css";
import{getClientId,getApi}from"../shared/userSession";

export default function MobileForgotPassword(){
const companyName="Gold 365";
const[name,setName]=useState("");
const[mobile,setMobile]=useState("");
const[loading,setLoading]=useState(false);

const requestReset=async()=>{
if(!name.trim()||!mobile.trim()){alert("Name aur mobile number dono bharo");return;}
try{
setLoading(true);
const res=await fetch(`${getApi()}/auth/forgot-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:getClientId(),name:name.trim(),mobile:mobile.trim()})});
const data=await res.json();
if(!res.ok){alert(data.detail||"Reset request submit nahi hua");return;}
alert("Password reset request submitted");
}catch(err){alert("Backend connect nahi ho raha");}finally{setLoading(false);}
};

return(
<div className="mforgot-page">
<div className="mforgot-bg"/>
<div className="mforgot-shade"/>
<main className="mforgot-box">
<a className="mforgot-back-login" href={`/login${window.location.search}`}><ArrowLeft/> Back to Login</a>
<header className="mforgot-brand"><div className="mforgot-mark">♛</div><h1>{companyName}</h1><p>SUPPORT • VERIFY • RESET</p></header>
<div className="mforgot-intro"><span>ACCOUNT RECOVERY</span><strong>Reset your password</strong><small>Enter the details registered with your account</small></div>
<label htmlFor="forgot-name">Registered Name</label>
<div className="mforgot-input"><UserRound/><i/><input id="forgot-name" autoComplete="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter registered name"/></div>
<label htmlFor="forgot-mobile">Mobile Number</label>
<div className="mforgot-input"><Smartphone/><span>🇮🇳 +91</span><i/><input id="forgot-mobile" inputMode="numeric" autoComplete="tel" value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Enter mobile number"/></div>
<button className="mforgot-reset-btn" onClick={requestReset} disabled={loading}>{loading?<span className="mforgot-loader"/>:<><span>REQUEST PASSWORD RESET</span><ArrowRight/></>}</button>
<a className="mforgot-telegram-support" href="https://t.me/YOUR_TELEGRAM_USERNAME" target="_blank" rel="noreferrer"><Headphones/> Contact Telegram Support</a>
<div className="mforgot-login-row"><span>Remember password?</span><a href={`/login${window.location.search}`}>Login</a></div>
<footer className="mforgot-security"><ShieldCheck/><span><b>Protected recovery</b><small>Your request is securely submitted</small></span></footer>
</main>
</div>
);
}
