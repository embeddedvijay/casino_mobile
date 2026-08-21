const SUITS=["♠","♥","♦","♣"],RANKS=[2,3,4,5,6,7,8,9,10,11,12,13,14];
export const rankLabel=r=>({11:"J",12:"Q",13:"K",14:"A"}[r]||String(r));
export const isRedSuit=s=>s==="♥"||s==="♦";
export function createDeck(){return SUITS.flatMap(suit=>RANKS.map(rank=>({suit,rank,id:`${suit}-${rank}`})))}
export function shuffleDeck(){const d=createDeck();for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d}
const sequenceHigh=r=>{const u=[...new Set(r)].sort((a,b)=>a-b);if(u.join(",")==="2,3,14")return 13.5;if(u.length===3&&u[1]===u[0]+1&&u[2]===u[1]+1)return u[2];return 0};
export function evaluateHand(cards){const ranks=cards.map(c=>c.rank).sort((a,b)=>b-a),same=cards.every(c=>c.suit===cards[0].suit),seq=sequenceHigh(ranks),counts={};ranks.forEach(r=>counts[r]=(counts[r]||0)+1);const groups=Object.entries(counts).map(([rank,count])=>({rank:+rank,count})).sort((a,b)=>b.count-a.count||b.rank-a.rank);if(groups[0].count===3)return{level:6,name:"TRAIL",values:[groups[0].rank]};if(same&&seq)return{level:5,name:"PURE SEQUENCE",values:[seq]};if(seq)return{level:4,name:"SEQUENCE",values:[seq]};if(same)return{level:3,name:"COLOR",values:ranks};if(groups[0].count===2)return{level:2,name:"PAIR",values:[groups[0].rank,groups[1].rank]};return{level:1,name:"HIGH CARD",values:ranks}}
export function compareHands(a,b){const x=evaluateHand(a),y=evaluateHand(b);if(x.level!==y.level)return x.level-y.level;for(let i=0;i<Math.max(x.values.length,y.values.length);i++){const d=(x.values[i]||0)-(y.values[i]||0);if(d)return d}return 0}
export function dealHands(){const d=shuffleDeck();return{user:d.slice(0,3),bot1:d.slice(3,6),bot2:d.slice(6,9)}}
