export const BUBBLE_COLORS=["ruby","aqua","violet","lime","gold"];
export const ROWS=11;
export const COLS=9;
const bubble=()=>({id:`b-${Date.now()}-${Math.random()}`,color:BUBBLE_COLORS[Math.floor(Math.random()*BUBBLE_COLORS.length)]});
export const createBubbleBoard=()=>Array.from({length:ROWS},(_,row)=>Array.from({length:COLS},()=>row<5?bubble():null));
export const bubbleShooterService={
  async startLevel(level=1){return{level,score:0,target:1200+(level-1)*350,misses:0,board:createBubbleBoard(),current:bubble(),next:bubble()}},
  async saveProgress(state){
    // Later: POST /api/games/bubble-shooter/progress
    return{ok:true,state};
  }
};
export const newBubble=bubble;
