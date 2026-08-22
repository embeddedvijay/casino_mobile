import React,{useEffect,useRef,useState}from"react";
import"./MobilematkaDashboardInput.css";

import { API_BASE } from "../../config.js";
const API=API_BASE;

const playLabel=(key,marketName)=>`${String(marketName||"").replaceAll("_"," ")} ${String(key||"").endsWith("_CL")?"CLOSE":"OPEN"}`;

const normalizeKey=value=>String(value||"")
  .trim()
  .toUpperCase()
  .replace(/[\s-]+/g,"_");

const cleanResult=value=>{
  if(value===undefined||value===null)return"";
  const text=String(value).trim();
  return["","*","**","-","--","***","***-*","***-**"].includes(text)?"":text;
};

const readField=(record,names)=>{
  if(record===undefined||record===null)return"";
  if(typeof record!=="object")return cleanResult(record);
  for(const name of names){
    const matched=Object.keys(record).find(key=>normalizeKey(key)===normalizeKey(name));
    if(matched){
      const value=cleanResult(record[matched]);
      if(value)return value;
    }
  }
  return"";
};

const parseMarketResults=(data,marketName)=>{
  const wanted=normalizeKey(marketName).replace(/_(OP|CL)$/g,"");
  const roots=[data?.Result,data?.result,data?.results,data?.data,data]
    .filter(value=>value!==undefined&&value!==null);
  let open="";
  let close="";

  const readRecord=(record,recordName="")=>{
    if(!record||typeof record!=="object")return;
    const name=normalizeKey(recordName||record.market_name||record.market||record.name||record.key||record.market_key);
    const base=name.replace(/_(OP|CL)$/g,"");
    if(base&&base!==wanted)return;

    if(name===`${wanted}_OP`){
      open=open||readField(record,["value","result","number","jodi","OPEN","OPEN_RESULT"]);
    }else if(name===`${wanted}_CL`){
      close=close||readField(record,["value","result","number","jodi","CLOSE","CLOSE_RESULT"]);
    }else{
      open=open||readField(record,["OPEN","OP","OPEN_RESULT","openResult"]);
      close=close||readField(record,["CLOSE","CL","CLOSE_RESULT","closeResult"]);
    }
  };

  for(const root of roots){
    if(Array.isArray(root)){
      root.forEach(row=>readRecord(row));
      continue;
    }
    if(!root||typeof root!=="object")continue;

    for(const [key,value] of Object.entries(root)){
      const normalized=normalizeKey(key);
      if(normalized===`${wanted}_OP`){
        open=open||readField(value,["value","result","number","jodi","OPEN","OPEN_RESULT"]);
      }else if(normalized===`${wanted}_CL`){
        close=close||readField(value,["value","result","number","jodi","CLOSE","CLOSE_RESULT"]);
      }else if(normalized.replace(/_(OP|CL)$/g,"")===wanted){
        readRecord(value,key);
      }
    }
  }

  return{open,close};
};

const indiaMinutesNow=()=>{
  const parts=new Intl.DateTimeFormat("en-GB",{
    timeZone:"Asia/Kolkata",
    hour:"2-digit",
    minute:"2-digit",
    hourCycle:"h23"
  }).formatToParts(new Date());
  const hour=Number(parts.find(item=>item.type==="hour")?.value||0);
  const minute=Number(parts.find(item=>item.type==="minute")?.value||0);
  return hour*60+minute;
};

const timeToMinutes=value=>{
  const match=String(value||"").trim().match(/^(\d{1,2}):(\d{2})/);
  if(!match)return null;
  const hour=Number(match[1]);
  const minute=Number(match[2]);
  if(hour>23||minute>59)return null;
  return hour*60+minute;
};

const resolvePlayTimeKey=async(marketName)=>{
  try{
    const[configRes,resultRes]=await Promise.all([
      fetch(`${API}/api/games/matka/markets`,{cache:"no-store"}),
      fetch(`${API}/api/games/matka/results/latest`,{cache:"no-store"})
    ]);
    const configData=configRes.ok?await configRes.json():{};
    const markets=Array.isArray(configData)?configData:Array.isArray(configData?.markets)?configData.markets:[];
    const wanted=normalizeKey(marketName);
    const config=markets.find(item=>normalizeKey(
      item.key||item.market_key||item.market_name||item.name
    ).replace(/_(OP|CL)$/g,"")===wanted);
    const closeMinutes=timeToMinutes(
      config?.close_time||config?.closeTime||config?.close||config?.close_bet_time
    );
    const resultData=resultRes.ok?await resultRes.json():{};
    const{open,close}=parseMarketResults(resultData,marketName);
    const now=indiaMinutesNow();

    /* Close result or configured close time means no more entries. */
    if(close)return"CLOSED";
    if(closeMinutes!==null&&now>=closeMinutes)return"CLOSED";

    /* Open result switches the play to CLOSE until closing time. */
    if(open)return`${marketName}_CL`;

    /* Until an open result exists, entry remains OPEN. */
    return`${marketName}_OP`;
  }catch(e){
    console.error("Market phase check failed",e);
    return`${marketName}_OP`;
  }
};

const nowTime=()=>new Date().toLocaleTimeString([],{
  hour:"2-digit",
  minute:"2-digit"
});

export default function MatkaInput({marketName:marketFromApp=""}){
  const marketName=(marketFromApp||decodeURIComponent(window.location.pathname.split("/matka/market-input/")[1]||"")).toUpperCase();

  const[message,setMessage]=useState("");
  const[sentMessage,setSentMessage]=useState("");
  const[serverResponse,setServerResponse]=useState("");
  const[timeKey,setTimeKey]=useState("");
  const[loading,setLoading]=useState(false);
  const[confirming,setConfirming]=useState(false);
  const[confirmed,setConfirmed]=useState(false);
  const[confirmedMessage,setConfirmedMessage]=useState("");
  const[msgTime,setMsgTime]=useState("");
  const[responseTime,setResponseTime]=useState("");
  const[confirmTime,setConfirmTime]=useState("");
  const bodyRef=useRef(null);
  const textareaRef=useRef(null);

  useEffect(()=>{
    if(bodyRef.current){
      bodyRef.current.scrollTop=bodyRef.current.scrollHeight;
    }
  },[sentMessage,serverResponse,confirmed,loading]);

  const goBack=()=>{
    window.history.back();
  };

  const resizeTextarea=el=>{
    if(!el)return;
    el.style.height="auto";
    el.style.height=Math.min(el.scrollHeight,150)+"px";
  };

  const changeMessage=e=>{
    setMessage(e.target.value);
    resizeTextarea(e.target);
  };

  const clearInput=()=>{
    setMessage("");
    if(textareaRef.current){
      textareaRef.current.style.height="42px";
    }
  };

  const sendMessage=async()=>{
    if(!message.trim()){
      alert("Message type karo");
      return;
    }

    if(!marketName){
      alert("Market name nahi mila");
      return;
    }

    const cleanMessage=message.trim();

    const nextTimeKey=await resolvePlayTimeKey(marketName);
    if(nextTimeKey==="CLOSED"){
      setTimeKey("CLOSED");
      setSentMessage(cleanMessage);
      setServerResponse("Market is closed");
      setMsgTime(nowTime());
      setResponseTime(nowTime());
      setConfirmed(false);
      clearInput();
      return;
    }

    setLoading(true);
    setServerResponse("");
    setConfirmed(false);
    setSentMessage(cleanMessage);
    setMsgTime(nowTime());
    setTimeKey(nextTimeKey);
    clearInput();

    try{
      const res=await fetch(`${API}/api/games/matka/market-message`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          client_id:"demo",
          user_id:localStorage.getItem("user_id")||"guest",
          market_name:marketName,
          time_key:nextTimeKey,
          message:cleanMessage
        })
      });

      const data=await res.json();

      if(data.success){
        const resultText=Array.isArray(data.result)
          ? data.result.map(row=>{
              const nums=row.slice(0,-1).join(", ");
              const amount=row[row.length-1];
              return `${nums} = ${amount}`;
            }).join("\n")
          : "";

        setServerResponse(`${playLabel(data.time_key||nextTimeKey,marketName)}\n\n${resultText}\n\nTOTAL = ${data.total}\n\nConfirm karna hai?`);
      }else{
        setServerResponse(data.reply||data.message||"Invalid game format");
      }

      setResponseTime(nowTime());
    }catch(e){
      setServerResponse("Backend error");
      setResponseTime(nowTime());
    }

    setLoading(false);
  };

  const confirmMessage=async()=>{
    if(serverResponse==="Market is closed")return;
    if(!serverResponse){
      alert("Pehle send karo");
      return;
    }

    setConfirming(true);

    try{
      const res=await fetch(`${API}/api/games/matka/market-message/confirm`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          client_id:"demo",
          user_id:localStorage.getItem("user_id")||"guest",
          market_name:marketName,
          market:marketName,
          time_key:timeKey||marketName,
          message:sentMessage,
          server_response:serverResponse
        })
      });

      const data=await res.json();

      if(data.success!==false){
        const confirmedKey=data.time_key||timeKey||marketName;
        setConfirmedMessage(`✅ GAME CONFIRMED\n\n${playLabel(confirmedKey,marketName)}\n\nConfirmed Message:\n${sentMessage}\n\nTOTAL = ${data.total??"-"}`);
        setConfirmed(true);
        setConfirmTime(nowTime());
      }else{
        alert(data.message||data.reply||"Confirm failed");
      }
    }catch(e){
      alert("Confirm error");
    }

    setConfirming(false);
  };

  return(
    <div className="mci-chat-page">
      <header className="mci-chat-top">
        <button className="mci-chat-back" onClick={goBack}>‹</button>

        <div className="mci-chat-logo">
          <span>♛</span>
        </div>

        <div className="mci-chat-title">
          <h3>{marketName||"MARKET"}</h3>
          <p>Market Message</p>
        </div>

        <div className="mci-secure">
          <span>🛡</span>
          <b>Secure</b>
        </div>
      </header>

      <main className="mci-chat-body" ref={bodyRef}>
        <div className="mci-date-pill">
          Today
        </div>

        <div className="mci-msg-row bot">
          <div className="mci-bot-icon">🤖</div>
          <div className="mci-bubble bot">
            <p>Welcome to <b>{marketName?.split("_").join(" ")}</b> market.</p>
            <small>{nowTime()}</small>
          </div>
        </div>

        {sentMessage&&(
          <div className="mci-msg-row user">
            <div className="mci-bubble user">
              <p>{sentMessage}</p>
              <small>{msgTime} ✓✓</small>
            </div>
          </div>
        )}

        {loading&&(
          <div className="mci-msg-row bot">
            <div className="mci-bot-icon">🤖</div>
            <div className="mci-bubble bot">
              <p>Checking...</p>
              <small>{nowTime()}</small>
            </div>
          </div>
        )}

        {serverResponse&&(
          <div className="mci-msg-row bot">
            <div className="mci-bot-icon">🤖</div>
            <div className="mci-bubble bot response">
              <h4>{timeKey==="CLOSED"?`${marketName.replaceAll("_"," ")} CLOSED`: `${playLabel(timeKey,marketName)} RESPONSE`}</h4>
              <pre>{serverResponse}</pre>
              <small>{responseTime}</small>
            </div>
          </div>
        )}

        {serverResponse!=="Market is closed"&&serverResponse&&!confirmed&&(
          <button className="mci-confirm-message" onClick={confirmMessage} disabled={confirming}>
            <span>🛡</span>
            {confirming?"CONFIRMING...":"CONFIRM MESSAGE"}
          </button>
        )}

        {confirmed&&(
          <>
            <div className="mci-msg-row user">
              <div className="mci-bubble user">
                <p>Confirm</p>
                <small>{confirmTime} ✓✓</small>
              </div>
            </div>

            <div className="mci-msg-row bot">
              <div className="mci-bot-icon">🤖</div>
              <div className="mci-bubble bot">
                <pre>{confirmedMessage}</pre>
                <small>{confirmTime}</small>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="mci-chat-input">
        <div className="mci-input-box">
          <span>☺</span>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={changeMessage}
            onKeyDown={(e)=>{
              if(e.key==="Enter"&&e.ctrlKey){
                e.preventDefault();
                sendMessage();
              }
            }}
            maxLength={500}
            placeholder="Pls send your game..."
            rows={1}
          />
        </div>

        <button className="mci-send-btn" onClick={sendMessage} disabled={loading}>
          {loading?"...":"➤"}
        </button>
      </footer>


    </div>
  );
}
