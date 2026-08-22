import React,{useState}from"react";
import{ArrowRight,Eye,EyeOff,LockKeyhole,ShieldCheck,Smartphone,UserRound}from"lucide-react";
import"./MobileLoginPage.css";
import{saveUserSession,getClientId,getApi}from"../shared/userSession";

const getRedirect=()=>new URLSearchParams(window.location.search).get("redirect")||"/";

export default function MobileLoginPage(){
const[companyName]=useState("Gold 365");
const[mobile,setMobile]=useState("");
const[password,setPassword]=useState("");
const[loading,setLoading]=useState(false);
const[demoLoading,setDemoLoading]=useState(false);
const[showPassword,setShowPassword]=useState(false);

const login=async()=>{
if(!mobile.trim()||!password.trim()){alert("Mobile number aur password bharo");return;}
try{
setLoading(true);
const res=await fetch(`${getApi()}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:getClientId(),mobile:mobile.trim(),password:password})});
const data=await res.json();
if(!res.ok){alert(data.detail||"Login failed");return;}
saveUserSession(data.user);
window.location.href=getRedirect();
}catch(err){alert("Backend connect nahi ho raha");}finally{setLoading(false);}
};

const loginDemo=async()=>{
try{
setDemoLoading(true);
const res=await fetch(`${getApi()}/auth/demo-login?client_id=${getClientId()}`,{method:"POST"});
const data=await res.json();
if(!res.ok){alert(data.detail||"Demo login failed");return;}
saveUserSession(data.user);
window.location.href=getRedirect();
}catch(err){
localStorage.setItem("client_id",getClientId());
localStorage.setItem("user","DEMO123");
localStorage.setItem("user_name","DEMO123");
localStorage.setItem("balance","0");
localStorage.setItem("isDemo","true");
window.location.href=getRedirect();
}finally{setDemoLoading(false);}
};

return(
<div className="mlogin-page">
<div className="mlogin-bg"/>
<div className="mlogin-shade"/>
<main className="mlogin-box">
<header className="mlogin-brand"><div className="mlogin-mark">♛</div><h1>{companyName}</h1><p>PLAY • WIN • REPEAT</p></header>
<div className="mlogin-welcome"><span>SECURE PLAYER LOGIN</span><strong>Welcome back</strong><small>Continue to your Gold365 account</small></div>
<label htmlFor="login-mobile">Mobile Number</label>
<div className="mlogin-input"><Smartphone/><span>🇮🇳 +91</span><i/><input id="login-mobile" inputMode="numeric" autoComplete="tel" value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Enter mobile number"/></div>
<label htmlFor="login-password">Password</label>
<div className="mlogin-input"><LockKeyhole/><i/><input id="login-password" value={password} onChange={(e)=>setPassword(e.target.value)} type={showPassword?"text":"password"} autoComplete="current-password" placeholder="Enter password"/><button type="button" aria-label={showPassword?"Hide password":"Show password"} onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff/>:<Eye/>}</button></div>
<a className="mlogin-forgot" href={`/forgot-password${window.location.search}`}>Forgot Password?</a>
<button className="mlogin-btn" onClick={login} disabled={loading}>{loading?<span className="mlogin-loader"/>:<><span>LOGIN</span><ArrowRight/></>}</button>
<div className="mlogin-or"><span/>OR CONTINUE WITH<span/></div>
<button className="mlogin-demo-btn" onClick={loginDemo} disabled={demoLoading}><UserRound/>{demoLoading?"PLEASE WAIT...":"LOGIN WITH DEMO ID"}</button>
<div className="mlogin-signup-row"><span>Don't have an account?</span><a href={`/create-account${window.location.search}`} className="mlogin-create-account-link">Create Account</a></div>
<footer className="mlogin-security"><ShieldCheck/><span><b>Secure login</b><small>Your session is protected</small></span></footer>
</main>
</div>
);
}
