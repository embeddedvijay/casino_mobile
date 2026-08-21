const suits=["♠","♥","♦","♣"];
const ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

export const makeDeck=()=>{
  const deck=[];
  suits.forEach((suit)=>ranks.forEach((rank)=>deck.push({id:`${rank}${suit}-${Math.random()}`,rank,suit,red:suit==="♥"||suit==="♦"})));
  return deck.sort(()=>Math.random()-.5);
};

export const newRound=(balance=1000,history=[])=>{
  const deck=makeDeck();
  return {balance,history,deck,joker:deck.pop(),andar:[],bahar:[],choice:null,bet:20,phase:"choose",winner:null,message:"ANDAR या BAHAR चुनिए"};
};

export const playRound=(round,choice)=>{
  if(round.phase!=="choose"||round.balance<round.bet)return round;
  const deck=[...round.deck],andar=[],bahar=[],deals=[];
  let side="andar",winner=null;
  while(deck.length&& !winner){
    const card=deck.pop();
    (side==="andar"?andar:bahar).push(card);
    deals.push({side,card});
    if(card.rank===round.joker.rank)winner=side;
    side=side==="andar"?"bahar":"andar";
  }
  const won=winner===choice;
  return {...round,deck,andar:[],bahar:[],deals,dealIndex:0,choice,winner,pendingBalance:round.balance+(won?round.bet:-round.bet),won,phase:"dealing",message:"CARDS DEALING..."};
};

export const dealNextCard=(round)=>{
  if(round.phase!=="dealing")return round;
  const deal=round.deals[round.dealIndex];
  if(!deal)return finishRound(round);
  return {...round,[deal.side]:[...round[deal.side],deal.card],dealIndex:round.dealIndex+1};
};

export const finishRound=(round)=>({...round,phase:"result",balance:round.pendingBalance,message:round.won?`आपने ${round.bet} coins जीते`:`${round.winner.toUpperCase()} जीता`,history:[{winner:round.winner,choice:round.choice,bet:round.bet,won:round.won},...round.history].slice(0,6)});
