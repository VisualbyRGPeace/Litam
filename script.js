from pathlib import Path
import zipfile, re

out = Path("/mnt/data/LiTam_fixed")
out.mkdir(exist_ok=True)

# Use the uploaded CSS as the base, then add only the CSS needed by the timer/history UI.
css = Path("/mnt/data/Văn bản đã dán (1).txt").read_text(encoding="utf-8")
css += r'''

/* ===== TIMER ===== */
.game-topbar-center{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:18px;
}
.timer-box{
  min-width:100px;
  height:38px;
  padding:0 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:4px;
  border:1px solid rgba(255,255,255,.08);
  border-radius:8px;
  background:rgba(255,255,255,.045);
}
.timer-label{
  margin-right:4px;
  color:var(--muted);
  font-size:8px;
  font-weight:700;
  letter-spacing:.08em;
}
.timer-box strong{
  min-width:22px;
  color:var(--accent);
  font-size:17px;
  text-align:right;
}
.timer-unit{color:var(--muted);font-size:10px}
.timer-box.warning{border-color:rgba(216,70,70,.55)}
.timer-box.warning strong{color:#ff7373}
.timer-box.danger{
  background:rgba(216,70,70,.12);
  animation:timerPulse .7s ease-in-out infinite alternate;
}
@keyframes timerPulse{from{transform:scale(1)}to{transform:scale(1.035)}}

/* ===== MOVE HISTORY ===== */
.move-history{
  position:absolute;
  z-index:7;
  top:28px;
  right:25px;
  width:225px;
  max-height:390px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.09);
  border-radius:13px;
  background:rgba(5,18,13,.72);
  backdrop-filter:blur(14px);
  box-shadow:0 14px 35px rgba(0,0,0,.16);
}
.history-header{
  padding:13px 14px 11px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:1px solid rgba(255,255,255,.07);
}
.history-kicker{
  color:rgba(255,255,255,.4);
  font-size:8px;
  font-weight:700;
  letter-spacing:.15em;
}
.history-header h2{
  margin-top:2px;
  font-size:14px;
  font-weight:600;
}
.history-count{
  min-width:24px;height:24px;padding:0 6px;
  display:grid;place-items:center;
  border-radius:6px;
  background:rgba(255,255,255,.07);
  color:var(--muted);
  font-size:10px;
}
.move-history-list{
  max-height:325px;
  overflow-y:auto;
  scrollbar-width:thin;
}
.move-history-list::-webkit-scrollbar{width:4px}
.move-history-list::-webkit-scrollbar-thumb{
  background:rgba(255,255,255,.15);
  border-radius:4px;
}
.history-empty{
  padding:24px 14px;
  color:rgba(255,255,255,.35);
  font-size:11px;
  text-align:center;
}
.move-entry{
  padding:9px 12px;
  border-bottom:1px solid rgba(255,255,255,.045);
}
.move-entry:last-child{border-bottom:0}
.move-entry.latest{background:rgba(215,181,106,.07)}
.move-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
}
.move-player{
  overflow:hidden;
  color:rgba(255,255,255,.78);
  font-size:10px;
  font-weight:700;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.move-number{color:rgba(255,255,255,.25);font-size:9px}
.move-cards{
  min-height:24px;
  margin-top:5px;
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:3px;
}
.mini-card{
  min-width:25px;height:31px;padding:3px 4px;
  display:inline-flex;
  align-items:flex-start;
  justify-content:center;
  border-radius:4px;
  background:#f0f0ee;
  color:#111;
  font-size:10px;
  font-weight:700;
  line-height:1;
}
.mini-card.red{color:var(--red)}
.pass-mark{
  color:rgba(255,255,255,.4);
  font-size:10px;
  font-style:italic;
}

@media (max-width:1050px){
  .move-history{right:15px;width:195px}
  .opponent-right{right:225px}
  .my-player{width:min(820px,70%)}
}
@media (max-width:850px){
  .move-history{
    top:74px;right:12px;width:185px;max-height:245px;
  }
  .move-history-list{max-height:180px}
}
@media (max-width:620px){
  .game-topbar-center{gap:7px}
  .timer-box{min-width:88px}
  .timer-label{display:none}
  .move-history{
    top:65px;right:10px;width:165px;max-height:205px;
  }
  .move-history-list{max-height:140px}
  .history-header{padding:9px 10px}
  .history-header h2{font-size:12px}
  .move-entry{padding:7px 9px}
}
@media (max-width:430px){
  .move-history{width:150px;max-height:185px}
  .move-history-list{max-height:120px}
}
'''

# Add timer/history to the original HTML without changing its login structure.
html = Path("/mnt/data/LiTam_fixed/index.html")
# Build from the prior exact HTML retrieved from Files.
# (The complete HTML is written explicitly here to avoid relying on a transient file path.)
html_text = r'''<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0b0f14">
  <title>Lì Tám — Tiến Lên</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./style.css">
</head>
<body>
<div id="app">

<section id="loginScreen" class="screen login-screen active">
  <div class="login-card">
    <div class="brand-large">LÌ TÁM</div>
    <div class="login-subtitle">Tiến Lên Online</div>
    <div class="input-group">
      <label for="playerName">Tên người chơi</label>
      <input id="playerName" type="text" maxlength="16" autocomplete="off" placeholder="Nhập tên của bạn">
    </div>
    <button id="loginBtn" class="btn btn-primary btn-large" type="button">VÀO GAME</button>
    <div class="login-note">Phiên bản thử nghiệm</div>
  </div>
</section>

<section id="homeScreen" class="screen">
  <header class="topbar">
    <div class="brand">LÌ TÁM</div>
    <div class="profile">
      <div class="profile-avatar"><span id="profileInitial">P</span></div>
      <div class="profile-name"><span id="homePlayerName">Player</span></div>
      <button id="logoutBtn" class="text-btn" type="button">Đăng xuất</button>
    </div>
  </header>
  <main class="home-container">
    <div class="section-label">LÌ TÁM GAME</div>
    <h1>Chọn trò chơi</h1>
    <p class="home-description">Chọn một trò chơi để bắt đầu.</p>
    <div class="game-grid">
      <button id="tienLenBtn" class="game-card" type="button">
        <div class="game-card-top"><div class="game-icon">♠</div><span class="game-status">PLAY</span></div>
        <h2>Tiến Lên</h2><p>Tiến Lên miền Nam</p><div class="game-card-footer">4 người chơi</div>
      </button>
      <div class="game-card disabled">
        <div class="game-card-top"><div class="game-icon">♦</div><span class="game-status">SOON</span></div>
        <h2>Xì Dách</h2><p>Game bài Xì Dách</p><div class="game-card-footer">Đang phát triển</div>
      </div>
      <div class="game-card disabled">
        <div class="game-card-top"><div class="game-icon">♟</div><span class="game-status">SOON</span></div>
        <h2>Cờ Vua</h2><p>Chess Online</p><div class="game-card-footer">Đang phát triển</div>
      </div>
    </div>
  </main>
</section>

<section id="lobbyScreen" class="screen">
  <header class="topbar">
    <div class="brand">LÌ TÁM</div>
    <button id="backHomeBtn" class="text-btn" type="button">← Trang chủ</button>
  </header>
  <main class="lobby-container">
    <div class="lobby-heading">
      <div>
        <div class="section-label">TIẾN LÊN</div>
        <h1>Phòng chơi</h1>
        <p>Tạo phòng hoặc tham gia một bàn đang chờ.</p>
      </div>
      <button id="createRoomBtn" class="btn btn-primary" type="button">+ TẠO PHÒNG</button>
    </div>
    <div id="roomList" class="room-list"></div>
  </main>
</section>

<section id="gameScreen" class="screen game-screen">
  <header class="game-topbar">
    <div class="brand">LÌ TÁM</div>
    <div class="game-topbar-center">
      <div class="game-room">PHÒNG <strong id="roomIdText">LT-000</strong></div>
      <div id="timerBox" class="timer-box" aria-live="polite">
        <span class="timer-label">THỜI GIAN</span>
        <strong id="turnTimer">30</strong>
        <span class="timer-unit">s</span>
      </div>
    </div>
    <button id="leaveGameBtn" class="text-btn" type="button">Rời phòng</button>
  </header>

  <main class="table">
    <div id="player2" class="opponent opponent-top">
      <div class="opponent-avatar">P2</div>
      <div class="opponent-details"><strong>Player 2</strong><small>13 lá</small></div>
    </div>
    <div id="player3" class="opponent opponent-left">
      <div class="opponent-avatar">P3</div>
      <div class="opponent-details"><strong>Player 3</strong><small>13 lá</small></div>
    </div>
    <div id="player4" class="opponent opponent-right">
      <div class="opponent-avatar">P4</div>
      <div class="opponent-details"><strong>Player 4</strong><small>13 lá</small></div>
    </div>

    <div class="center-table">
      <div id="turnText" class="turn-text">Đang chuẩn bị...</div>
      <div id="playedBy" class="played-by"></div>
      <div id="playedCards" class="played-cards"></div>
      <div id="message" class="game-message"></div>
    </div>

    <aside class="move-history">
      <div class="history-header">
        <div><span class="history-kicker">TIẾN LÊN</span><h2>Lịch sử</h2></div>
        <span id="historyCount" class="history-count">0</span>
      </div>
      <div id="moveHistory" class="move-history-list">
        <div class="history-empty">Chưa có nước đi</div>
      </div>
    </aside>

    <div class="my-player">
      <div class="my-player-header">
        <div class="my-player-info">
          <div class="my-avatar"><span id="myInitial">M</span></div>
          <div><strong id="gamePlayerName">Player</strong><small id="myCardCount">13 lá</small></div>
        </div>
        <div id="myTurnBadge" class="turn-badge hidden">LƯỢT CỦA BẠN</div>
      </div>
      <div id="myHand" class="hand"></div>
      <div class="game-actions">
        <button id="passBtn" class="btn btn-secondary" type="button">BỎ LƯỢT</button>
        <button id="playBtn" class="btn btn-primary" type="button">ĐÁNH</button>
      </div>
    </div>
  </main>
</section>

<div id="resultModal" class="modal-overlay">
  <div class="result-modal">
    <div class="result-icon">♛</div>
    <div id="resultTitle" class="result-title">Bạn thắng!</div>
    <div id="resultText" class="result-text">Ván đấu đã kết thúc.</div>
    <div class="result-actions">
      <button id="newGameBtn" class="btn btn-primary" type="button">CHƠI VÁN MỚI</button>
      <button id="resultHomeBtn" class="btn btn-secondary" type="button">VỀ TRANG CHỦ</button>
    </div>
  </div>
</div>

</div>
<script src="./script.js"></script>
</body>
</html>
'''

js = r'''/* =========================================
   LÌ TÁM — TIẾN LÊN
   Stable local version
   - Login uses loginBtn (not loginForm)
   - Local lobby
   - 1 human + 3 bots
   - 30-second human turn timer
   - Move history panel
   ========================================= */

"use strict";

const $ = id => document.getElementById(id);

const SUITS = [
  {key:"spades",symbol:"♠",red:false},
  {key:"clubs",symbol:"♣",red:false},
  {key:"diamonds",symbol:"♦",red:true},
  {key:"hearts",symbol:"♥",red:true}
];

const RANKS = [
  ["3",0],["4",1],["5",2],["6",3],["7",4],["8",5],
  ["9",6],["10",7],["J",8],["Q",9],["K",10],["A",11],["2",12]
].map(([key,value])=>({key,value}));

const state = {
  playerName: localStorage.getItem("litam_username") || "",
  roomId: localStorage.getItem("litam_current_room") || "LT-000",
  players: [],
  currentPlayer: 0,
  lastPlay: null,
  passCount: 0,
  selected: new Set(),
  history: [],
  timer: null,
  seconds: 30,
  botTimer: null,
  gameOver: false
};

document.addEventListener("DOMContentLoaded", init);

function init(){
  $("loginBtn").addEventListener("click", login);
  $("playerName").addEventListener("keydown",e=>{if(e.key==="Enter")login(e)});
  $("logoutBtn").addEventListener("click",logout);
  $("tienLenBtn").addEventListener("click",openLobby);
  $("backHomeBtn").addEventListener("click",()=>showScreen("homeScreen"));
  $("createRoomBtn").addEventListener("click",createRoom);
  $("leaveGameBtn").addEventListener("click",leaveGame);
  $("playBtn").addEventListener("click",playSelected);
  $("passBtn").addEventListener("click",()=>passTurn(false));
  $("newGameBtn").addEventListener("click",()=>{ $("resultModal").classList.remove("show"); startGame(); });
  $("resultHomeBtn").addEventListener("click",()=>{ $("resultModal").classList.remove("show"); showScreen("homeScreen"); });
  document.addEventListener("click",e=>{
    const b=e.target.closest(".join-room-btn");
    if(b) openRoom(b.dataset.room);
  });

  if(state.playerName){
    updateProfile();
    showScreen("homeScreen");
  }else{
    showScreen("loginScreen");
  }
  renderRooms();
}

function login(e){
  if(e) e.preventDefault();
  const input=$("playerName");
  const name=input.value.trim();
  if(!name){ input.focus(); return; }
  state.playerName=name;
  localStorage.setItem("litam_username",name);
  updateProfile();
  showScreen("homeScreen");
}

function logout(){
  stopTimer();
  clearTimeout(state.botTimer);
  localStorage.removeItem("litam_username");
  state.playerName="";
  $("playerName").value="";
  showScreen("loginScreen");
}

function updateProfile(){
  const n=state.playerName||"Player";
  $("homePlayerName").textContent=n;
  $("gamePlayerName").textContent=n;
  $("profileInitial").textContent=initials(n);
  $("myInitial").textContent=initials(n);
}

function initials(n){
  const p=n.trim().split(/\s+/).filter(Boolean);
  return p.length===1?p[0].slice(0,2).toUpperCase():(p[0][0]+p[p.length-1][0]).toUpperCase();
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
}

function rooms(){
  try{return JSON.parse(localStorage.getItem("litam_rooms")||"[]")}catch{return []}
}
function saveRooms(r){localStorage.setItem("litam_rooms",JSON.stringify(r.slice(-30)))}
function renderRooms(){
  const list=$("roomList"); if(!list)return;
  let r=rooms();
  if(!r.length){
    r=[
      {id:"LT-001",host:"Minh",players:2,maxPlayers:4},
      {id:"LT-002",host:"Khánh",players:1,maxPlayers:4},
      {id:"LT-003",host:"Long",players:3,maxPlayers:4}
    ];
    saveRooms(r);
  }
  list.innerHTML="";
  r.forEach(x=>{
    const row=document.createElement("div"); row.className="room";
    row.innerHTML=`<div class="room-left"><strong>${esc(x.id)}</strong><span>${esc(x.host)} · ${x.players}/${x.maxPlayers} người chơi</span></div>
      <div class="room-right"><span class="room-status">${x.players>=x.maxPlayers?"ĐẦY":"ĐANG CHỜ"}</span>
      <button type="button" class="btn btn-secondary join-room-btn" data-room="${esc(x.id)}" ${x.players>=x.maxPlayers?"disabled":""}>THAM GIA</button></div>`;
    list.appendChild(row);
  });
}
function openLobby(){renderRooms();showScreen("lobbyScreen")}
function createRoom(){
  const id=makeRoomId();
  const r=rooms();
  r.push({id,host:state.playerName||"Bạn",players:1,maxPlayers:4});
  saveRooms(r);
  openRoom(id);
}
function makeRoomId(){
  const r=rooms(); let id;
  do{id="LT-"+Math.floor(100+Math.random()*900)}while(r.some(x=>x.id===id));
  return id;
}
function openRoom(id){
  state.roomId=id;
  localStorage.setItem("litam_current_room",id);
  startGame();
  showScreen("gameScreen");
}

function createDeck(){
  const d=[];
  SUITS.forEach(s=>RANKS.forEach(r=>d.push({
    id:`${r.key}-${s.key}`,rank:r.key,rankValue:r.value,suit:s.key,suitSymbol:s.symbol,red:s.red
  })));
  return d;
}
function shuffle(a){
  a=[...a];
  for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function sortCards(a){
  return [...a].sort((x,y)=>x.rankValue-y.rankValue || suitOrder(x.suit)-suitOrder(y.suit));
}
function suitOrder(s){return {spades:0,clubs:1,diamonds:2,hearts:3}[s]||0}

function startGame(){
  stopTimer(); clearTimeout(state.botTimer);
  const deck=shuffle(createDeck());
  state.players=[
    {id:0,name:state.playerName||"Bạn",hand:[]},
    {id:1,name:"Minh",hand:[]},
    {id:2,name:"Khánh",hand:[]},
    {id:3,name:"Long",hand:[]}
  ];
  deck.forEach((c,i)=>state.players[i%4].hand.push(c));
  state.players.forEach(p=>p.hand=sortCards(p.hand));
  state.currentPlayer=state.players.findIndex(p=>p.hand.some(c=>c.rank==="3"&&c.suit==="spades"));
  if(state.currentPlayer<0)state.currentPlayer=0;
  state.lastPlay=null; state.passCount=0; state.selected.clear();
  state.history=[]; state.gameOver=false; state.seconds=30;
  $("roomIdText").textContent=state.roomId;
  $("resultModal").classList.remove("show");
  updateProfile(); renderAll(); beginTurn();
}

function beginTurn(){
  stopTimer(); clearTimeout(state.botTimer);
  if(state.gameOver)return;
  state.seconds=30; updateTimerUI(); renderTurnState();
  if(state.currentPlayer===0){
    setMessage("Bạn có 30 giây để đánh.");
    startTimer();
  }else{
    setMessage(`${state.players[state.currentPlayer].name} đang suy nghĩ...`);
    state.botTimer=setTimeout(()=>botMove(state.currentPlayer),850);
  }
}
function startTimer(){
  updateTimerUI();
  state.timer=setInterval(()=>{
    state.seconds=Math.max(0,state.seconds-1);
    updateTimerUI();
    if(state.seconds===0){
      stopTimer();
      if(state.currentPlayer===0&&!state.gameOver){
        setMessage("Hết 30 giây — tự động bỏ lượt.");
        setTimeout(()=>{if(state.currentPlayer===0&&!state.gameOver)passTurn(true)},250);
      }
    }
  },1000);
}
function stopTimer(){
  if(state.timer){clearInterval(state.timer);state.timer=null}
}
function updateTimerUI(){
  const t=$("turnTimer"),box=$("timerBox");
  if(!t||!box)return;
  t.textContent=state.currentPlayer===0&&!state.gameOver?state.seconds:"—";
  box.classList.toggle("warning",state.currentPlayer===0&&state.seconds<=10);
  box.classList.toggle("danger",state.currentPlayer===0&&state.seconds<=5);
}

function toggleCard(id){
  if(state.currentPlayer!==0||state.gameOver)return;
  state.selected.has(id)?state.selected.delete(id):state.selected.add(id);
  renderHand();
}
function selectedCards(){return sortCards(state.players[0].hand.filter(c=>state.selected.has(c.id)))}
function playSelected(){
  if(state.currentPlayer!==0||state.gameOver)return;
  const cards=selectedCards();
  if(!cards.length){setMessage("Hãy chọn ít nhất một quân bài.");return}
  const move=analyzeMove(cards);
  if(!move){setMessage("Bộ bài đã chọn không hợp lệ.");return}
  if(!canBeat(move,state.lastPlay)){setMessage("Bộ bài này không thể chặn lượt hiện tại.");return}
  executePlay(0,cards,move);
}
function passTurn(auto=false){
  if(state.currentPlayer!==0||state.gameOver)return;
  if(!state.lastPlay){setMessage("Bạn đang giữ lượt đầu tiên, không thể bỏ.");return}
  stopTimer(); state.selected.clear();
  addHistory(0,[],true,auto); state.passCount++;
  if(state.passCount>=3){resetTrick();return}
  state.currentPlayer=next(state.currentPlayer); renderAll(); beginTurn();
}
function executePlay(pi,cards,move){
  stopTimer(); clearTimeout(state.botTimer);
  const p=state.players[pi];
  p.hand=p.hand.filter(c=>!cards.some(x=>x.id===c.id));
  state.lastPlay={player:pi,cards:[...cards],move};
  state.passCount=0; state.selected.clear();
  addHistory(pi,cards,false,false);
  renderAll();
  if(!p.hand.length){finishGame(pi);return}
  state.currentPlayer=next(pi); beginTurn();
}
function resetTrick(){
  const p=state.lastPlay?state.lastPlay.player:state.currentPlayer;
  state.lastPlay=null; state.passCount=0; state.currentPlayer=p;
  setMessage(`${state.players[p].name} được mở lượt mới.`);
  renderAll(); beginTurn();
}

function botMove(pi){
  if(state.gameOver||state.currentPlayer!==pi)return;
  const p=state.players[pi];
  const move=chooseBotMove(p.hand,state.lastPlay);
  if(!move){
    if(!state.lastPlay){
      const c=[p.hand[0]]; executePlay(pi,c,analyzeMove(c));
    }else{
      addHistory(pi,[],true,false); state.passCount++;
      if(state.passCount>=3)resetTrick();
      else{state.currentPlayer=next(pi);renderAll();beginTurn()}
    }
    return;
  }
  executePlay(pi,move.cards,move);
}

function chooseBotMove(hand,last){
  const cards=sortCards(hand);
  if(!last)return cards.length?analyzeMove([cards[0]]):null;
  const candidates=generateCandidates(cards,last.move);
  for(const c of candidates)if(canBeat(c,last))return c;
  for(const c of generateSpecial(cards))if(canBeat(c,last))return c;
  return null;
}
function generateCandidates(cards,target){
  const out=[],count=target.count,g=groupByRank(cards);
  if(count===1)cards.forEach(c=>out.push(analyzeMove([c])));
  else if(count===2)Object.values(g).forEach(x=>{if(x.length>=2)out.push(analyzeMove(x.slice(0,2)))});
  else if(count===3)Object.values(g).forEach(x=>{if(x.length>=3)out.push(analyzeMove(x.slice(0,3)))});
  else if(count===4)Object.values(g).forEach(x=>{if(x.length>=4)out.push(analyzeMove(x.slice(0,4)))});
  else if(target.type==="straight")out.push(...straights(cards,count));
  else if(target.type==="threePairs")out.push(...consecutivePairs(cards,3));
  else if(target.type==="fourPairs")out.push(...consecutivePairs(cards,4));
  return out.filter(Boolean).sort((a,b)=>a.highValue-b.highValue);
}
function generateSpecial(cards){
  const out=[],g=groupByRank(cards);
  Object.values(g).forEach(x=>{if(x.length>=4)out.push(analyzeMove(x.slice(0,4)))});
  out.push(...consecutivePairs(cards,3),...consecutivePairs(cards,4));
  return out.filter(Boolean);
}
function straights(cards,len){
  const g=groupByRank(cards),r=Object.keys(g).map(Number).filter(x=>x<12).sort((a,b)=>a-b),out=[];
  for(let i=0;i<=r.length-len;i++){
    let ok=true;for(let j=1;j<len;j++)if(r[i+j]!==r[i]+j)ok=false;
    if(ok)out.push(analyzeMove(Array.from({length:len},(_,j)=>g[r[i+j]][0])));
  }
  return out;
}
function consecutivePairs(cards,n){
  const g=groupByRank(cards),r=Object.keys(g).map(Number).filter(x=>x<12&&g[x].length>=2).sort((a,b)=>a-b),out=[];
  for(let i=0;i<=r.length-n;i++){
    let ok=true;for(let j=1;j<n;j++)if(r[i+j]!==r[i]+j)ok=false;
    if(ok){
      const a=[];for(let j=0;j<n;j++)a.push(...g[r[i+j]].slice(0,2));
      out.push(analyzeMove(a));
    }
  }
  return out;
}

function analyzeMove(cards){
  const s=sortCards(cards),n=s.length,g=groupByRank(s),sizes=Object.values(g).map(x=>x.length).sort((a,b)=>a-b),r=Object.keys(g).map(Number).sort((a,b)=>a-b);
  if(n===1)return {type:"single",count:1,highValue:s[0].rankValue,cards:s};
  if(n===2&&sizes.length===1&&sizes[0]===2)return {type:"pair",count:2,highValue:r[0],cards:s};
  if(n===3&&sizes.length===1&&sizes[0]===3)return {type:"triple",count:3,highValue:r[0],cards:s};
  if(n===4&&sizes.length===1&&sizes[0]===4)return {type:"four",count:4,highValue:r[0],cards:s};
  if(n>=3&&isStraight(s))return {type:"straight",count:n,highValue:s[n-1].rankValue,cards:s};
  if(n>=6&&n%2===0&&isConsecutivePairs(s))return {type:n===6?"threePairs":"fourPairs",count:n,highValue:s[n-1].rankValue,cards:s};
  return null;
}
function isStraight(c){
  if(c.length<3)return false;
  const v=c.map(x=>x.rankValue);
  if(v.some(x=>x===12))return false;
  for(let i=1;i<v.length;i++)if(v[i]!==v[i-1]+1)return false;
  return new Set(v).size===v.length;
}
function isConsecutivePairs(c){
  const g=groupByRank(c),r=Object.keys(g).map(Number).sort((a,b)=>a-b);
  if(!r.length||r.some(x=>x===12)||Object.values(g).some(x=>x.length!==2))return false;
  for(let i=1;i<r.length;i++)if(r[i]!==r[i-1]+1)return false;
  return true;
}
function canBeat(m,last){
  if(!last)return true;
  const t=last.move;
  if(m.type===t.type&&m.count===t.count)return m.highValue>t.highValue;
  if(m.type==="four"&&t.highValue===12&&(t.type==="single"||t.type==="pair"))return true;
  if((m.type==="threePairs"||m.type==="fourPairs")&&t.type==="single"&&t.highValue===12)return true;
  return false;
}
function groupByRank(c){return c.reduce((g,x)=>(g[x.rankValue]??=[]).push(x)&&g,{});}
function next(i){return(i+1)%4}

function addHistory(pi,cards,isPass,auto){
  state.history.push({player:pi,cards:[...cards],isPass,auto,n:state.history.length+1});
  renderHistory();
}
function renderHistory(){
  const list=$("moveHistory"),count=$("historyCount");if(!list||!count)return;
  count.textContent=state.history.length;
  if(!state.history.length){list.innerHTML='<div class="history-empty">Chưa có nước đi</div>';return}
  list.innerHTML="";
  state.history.forEach((m,i)=>{
    const row=document.createElement("div");row.className="move-entry"+(i===state.history.length-1?" latest":"");
    const cards=m.isPass
      ? `<span class="pass-mark">${m.auto?"BỎ LƯỢT · 30s":"BỎ LƯỢT"}</span>`
      : m.cards.map(c=>`<span class="mini-card ${c.red?"red":""}">${c.rank}${c.suitSymbol}</span>`).join("");
    row.innerHTML=`<div class="move-top"><span class="move-player">${esc(state.players[m.player]?.name||"Player")}</span><span class="move-number">${m.n}</span></div><div class="move-cards">${cards}</div>`;
    list.appendChild(row);
  });
  list.scrollTop=list.scrollHeight;
}

function renderAll(){renderPlayers();renderHand();renderCenter();renderHistory();renderTurnState();updateTimerUI()}
function renderPlayers(){
  [[1,"player2"],[2,"player3"],[3,"player4"]].forEach(([i,id])=>{
    const el=$(id),p=state.players[i];if(!el||!p)return;
    el.querySelector("strong").textContent=p.name;
    el.querySelector("small").textContent=`${p.hand.length} lá`;
    el.classList.toggle("is-turn",state.currentPlayer===i);
  });
  $("myCardCount").textContent=`${state.players[0]?.hand.length||0} lá`;
}
function renderHand(){
  const el=$("myHand");if(!el||!state.players[0])return;
  el.innerHTML="";
  state.players[0].hand.forEach(c=>{
    const x=cardElement(c);x.classList.toggle("selected",state.selected.has(c.id));
    x.addEventListener("click",()=>toggleCard(c.id));el.appendChild(x);
  });
}
function renderCenter(){
  $("turnText").textContent=state.currentPlayer===0?"Đến lượt của bạn":`Đến lượt của ${state.players[state.currentPlayer]?.name||""}`;
  $("playedCards").innerHTML="";
  if(!state.lastPlay){$("playedBy").textContent="Chưa có nước đi";return}
  $("playedBy").textContent=`Bài của ${state.players[state.lastPlay.player].name}`;
  state.lastPlay.cards.forEach(c=>{$("playedCards").appendChild(cardElement(c))});
}
function renderTurnState(){
  const mine=state.currentPlayer===0&&!state.gameOver;
  $("myTurnBadge").classList.toggle("hidden",!mine);
  $("playBtn").disabled=!mine;
  $("passBtn").disabled=!mine||!state.lastPlay;
}
function cardElement(c){
  const x=document.createElement("div");
  x.className="card"+(c.red?" red":"");
  x.innerHTML=`<div class="card-rank">${c.rank}</div><div class="card-suit">${c.suitSymbol}</div><div class="card-center">${c.suitSymbol}</div>`;
  return x;
}
function setMessage(m){$("message").textContent=m}
function finishGame(pi){
  state.gameOver=true;stopTimer();clearTimeout(state.botTimer);
  const won=pi===0,p=state.players[pi];
  $("resultTitle").textContent=won?"Bạn thắng!":`${p.name} thắng!`;
  $("resultText").textContent=won?"Bạn đã đánh hết bài.":`${p.name} đã đánh hết bài trước bạn.`;
  $("resultModal").classList.add("show");renderAll();
}
function leaveGame(){stopTimer();clearTimeout(state.botTimer);state.gameOver=true;showScreen("lobbyScreen");renderRooms()}
function esc(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}

window.startGame=startGame;
window.showScreen=showScreen;
window.toggleCard=toggleCard;
'''

(out/"index.html").write_text(html_text, encoding="utf-8")
(out/"style.css").write_text(css, encoding="utf-8")
(out/"script.js").write_text(js, encoding="utf-8")

# Basic syntax check using node if available.
import subprocess, json, os, textwrap, sys
check = subprocess.run(["node","--check",str(out/"script.js")],capture_output=True,text=True)
print("Node syntax check:", "OK" if check.returncode==0 else check.stderr)

zip_path=Path("/mnt/data/LiTam_fixed_all.zip")
with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED) as z:
    for p in [out/"index.html",out/"style.css",out/"script.js"]:
        z.write(p,arcname=p.name)

print("Created:", zip_path)
print("index.html lines:", len(html_text.splitlines()))
print("style.css lines:", len(css.splitlines()))
print("script.js lines:", len(js.splitlines()))
