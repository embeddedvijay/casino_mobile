import React,{useState}from"react";
import{ArrowLeft,ArrowRight,Eye,EyeOff,LockKeyhole,ShieldCheck,Smartphone,UserRound}from"lucide-react";
import"./MobileCreateAccount.css";
import{getClientId,getApi}from"../shared/userSession";

export default function MobileCreateAccount(){
const companyName="Gold 365";
const[fullName,setFullName]=useState("");
const[mobile,setMobile]=useState("");
const[password,setPassword]=useState("");
const[confirmPassword,setConfirmPassword]=useState("");
const[loading,setLoading]=useState(false);
const[showPassword,setShowPassword]=useState(false);
const[showConfirm,setShowConfirm]=useState(false);

const createAccount=async()=>{
if(!fullName.trim()||!mobile.trim()||!password.trim()||!confirmPassword.trim()){alert("Sab field bharo");return;}
if(password!==confirmPassword){alert("Password match nahi hai");return;}
try{
setLoading(true);
const res=await fetch(`${getApi()}/auth/create-account`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:getClientId(),full_name:fullName.trim(),mobile:mobile.trim(),password:password,confirm_password:confirmPassword})});
const data=await res.json();
if(!res.ok){alert(data.detail||"Account create nahi hua");return;}
alert("Account created successfully");
window.location.href=`/login${window.location.search}`;
}catch(err){alert("Backend connect nahi ho raha");}finally{setLoading(false);}
};

return(
<div className="mcreate-page">
<div className="mcreate-bg"/>
<div className="mcreate-shade"/>
<main className="mcreate-box">
<a className="mcreate-back-login" href={`/login${window.location.search}`}><ArrowLeft/> Back to Login</a>
<header className="mcreate-brand"><div className="mcreate-mark">♛</div><h1>{companyName}</h1><p>JOIN NOW • START WINNING</p></header>
<div className="mcreate-intro"><span>NEW PLAYER REGISTRATION</span><strong>Create your account</strong><small>Fill your details to get started</small></div>
<label htmlFor="create-name">Full Name</label>
<div className="mcreate-input"><UserRound/><i/><input id="create-name" autoComplete="name" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Enter full name"/></div>
<label htmlFor="create-mobile">Mobile Number</label>
<div className="mcreate-input"><Smartphone/><span>🇮🇳 +91</span><i/><input id="create-mobile" inputMode="numeric" autoComplete="tel" value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Enter mobile number"/></div>
<label htmlFor="create-password">Password</label>
<div className="mcreate-input"><LockKeyhole/><i/><input id="create-password" value={password} onChange={(e)=>setPassword(e.target.value)} type={showPassword?"text":"password"} autoComplete="new-password" placeholder="Enter password"/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff/>:<Eye/>}</button></div>
<label htmlFor="create-confirm">Confirm Password</label>
<div className="mcreate-input"><LockKeyhole/><i/><input id="create-confirm" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type={showConfirm?"text":"password"} autoComplete="new-password" placeholder="Confirm password"/><button type="button" onClick={()=>setShowConfirm(value=>!value)}>{showConfirm?<EyeOff/>:<Eye/>}</button></div>
<button className="mcreate-btn" onClick={createAccount} disabled={loading}>{loading?<span className="mcreate-loader"/>:<><span>CREATE ACCOUNT</span><ArrowRight/></>}</button>
<div className="mcreate-login-row"><span>Already have an account?</span><a href={`/login${window.location.search}`}>Login</a></div>
<footer className="mcreate-security"><ShieldCheck/><span><b>Secure registration</b><small>Your information stays protected</small></span></footer>
</main>
</div>
);
}
