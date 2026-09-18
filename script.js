/* =========================================
   LÌ TÁM — TIẾN LÊN
   ========================================= */

:root {
  --bg: #080c11;
  --bg-soft: #0d131a;
  --panel: #111820;
  --panel-light: #17212b;
  --border: rgba(255,255,255,.09);
  --text: #f4f5f7;
  --muted: #8d99a6;
  --accent: #d7b56a;
  --accent-dark: #b89347;
  --table-1: #1b6549;
  --table-2: #10452f;
  --table-3: #08271c;
  --red: #d84646;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { min-height: 100%; }

body {
  min-height: 100vh;
  font-family: "DM Sans", Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
}

button, input { font-family: inherit; }
button { border: 0; }

.screen {
  display: none;
  min-height: 100vh;
}

.screen.active { display: block; }

/* LOGIN */
.login-screen {
  align-items: center;
  justify-content: center;
  padding: 25px;
  background: radial-gradient(circle at 50% 35%, #1a222b 0%, #0d1319 45%, #080c11 100%);
}

.login-screen.active { display: flex; }

.login-card {
  width: min(430px, 100%);
  padding: 55px 42px 40px;
  border: 1px solid var(--border);
  border-radius: 22px;
  background: rgba(17,24,32,.92);
  box-shadow: 0 35px 100px rgba(0,0,0,.4);
  text-align: center;
}

.brand-large {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 48px;
  line-height: 1;
  letter-spacing: .09em;
}

.login-subtitle { margin-top: 12px; color: var(--muted); font-size: 15px; }

.input-group { margin-top: 38px; text-align: left; }
.input-group label { display: block; margin-bottom: 8px; color: var(--muted); font-size: 12px; }
.input-group input {
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 11px;
  outline: none;
  background: #0a1016;
  color: white;
  font-size: 15px;
}
.input-group input:focus { border-color: rgba(215,181,106,.65); }
.login-note { margin-top: 18px; color: #596572; font-size: 11px; }

/* TOPBAR */
.topbar {
  height: 72px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: rgba(8,12,17,.85);
}

.brand {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 23px;
  letter-spacing: .1em;
}

.profile { display: flex; align-items: center; gap: 10px; }
.profile-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: grid; place-items: center;
  background: var(--panel-light);
  border: 1px solid var(--border);
  font-size: 11px; font-weight: 700;
}
.profile-name { font-size: 13px; }

.text-btn {
  padding: 8px 10px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}
.text-btn:hover { color: white; }

/* BUTTONS */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 19px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .04em;
  cursor: pointer;
  transition: transform .18s ease, filter .18s ease, background .18s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn:disabled { opacity: .42; cursor: not-allowed; transform: none; }
.btn-primary { background: var(--accent); color: #111; }
.btn-primary:hover { filter: brightness(1.08); }
.btn-secondary { background: rgba(255,255,255,.08); color: white; }
.btn-secondary:hover { background: rgba(255,255,255,.13); }
.btn-large { width: 120px; margin-top: 12px; }

/* HOME */
.home-container {
  width: min(1100px, 100%);
  margin: auto;
  padding: 90px 25px;
}

.section-label {
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .2em;
}

.home-container h1,
.lobby-container h1 {
  margin-top: 10px;
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(42px, 6vw, 68px);
  line-height: 1.05;
}

.home-description { margin-top: 16px; color: var(--muted); }

.game-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 55px;
}

.game-card {
  min-height: 290px;
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--panel);
  color: white;
  text-align: left;
  cursor: pointer;
  transition: transform .22s ease, border-color .22s ease, background .22s ease;
}

.game-card:not(.disabled):hover {
  transform: translateY(-5px);
  border-color: rgba(215,181,106,.45);
  background: var(--panel-light);
}
.game-card.disabled { opacity: .38; cursor: not-allowed; }
.game-card-top { display: flex; align-items: flex-start; justify-content: space-between; }
.game-icon { font-size: 58px; line-height: 1; }
.game-status {
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 5px;
  color: var(--muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .12em;
}
.game-card h2 { margin-top: 45px; font-size: 24px; }
.game-card p { margin-top: 7px; color: var(--muted); }
.game-card-footer { margin-top: 28px; color: #697582; font-size: 12px; }

/* LOBBY */
.lobby-container {
  width: min(1000px, 100%);
  margin: auto;
  padding: 75px 25px;
}

.lobby-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 40px;
}

.lobby-heading p { margin-top: 15px; color: var(--muted); }

.room-list { display: grid; gap: 10px; }

.room {
  min-height: 75px;
  padding: 15px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--panel);
}

.room-left strong { display: block; font-size: 14px; }
.room-left span { display: block; margin-top: 5px; color: var(--muted); font-size: 12px; }
.room-right { display: flex; align-items: center; gap: 15px; }
.room-status { color: #7e8994; font-size: 11px; }

/* GAME TOPBAR */
.game-screen { overflow: hidden; }

.game-topbar {
  height: 58px;
  padding: 0 25px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,.08);
  background: #090e13;
}

.game-topbar > .text-btn { justify-self: end; }
.game-topbar-center { display: flex; align-items: center; gap: 18px; }

.game-room {
  color: var(--muted);
  font-size: 10px;
  letter-spacing: .14em;
}
.game-room strong { margin-left: 6px; color: white; }

.timer-box {
  min-width: 100px;
  height: 38px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 8px;
  background: rgba(255,255,255,.045);
}

.timer-label {
  margin-right: 4px;
  color: var(--muted);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .08em;
}
.timer-box strong {
  min-width: 22px;
  color: var(--accent);
  font-size: 17px;
  text-align: right;
}
.timer-unit { color: var(--muted); font-size: 10px; }

.timer-box.warning {
  border-color: rgba(216,70,70,.55);
}
.timer-box.warning strong { color: #ff7373; }
.timer-box.danger {
  background: rgba(216,70,70,.12);
  animation: timerPulse .7s ease-in-out infinite alternate;
}

@keyframes timerPulse {
  from { transform: scale(1); }
  to { transform: scale(1.035); }
}

/* TABLE */
.table {
  position: relative;
  min-height: calc(100vh - 58px);
  overflow: hidden;
  background: radial-gradient(ellipse at center, var(--table-1) 0%, var(--table-2) 42%, var(--table-3) 100%);
}

.table::before {
  content: "";
  position: absolute;
  inset: 35px;
  border: 1px solid rgba(255,255,255,.055);
  border-radius: 40px;
  pointer-events: none;
}

.table::after {
  content: "LÌ TÁM";
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%) rotate(-8deg);
  color: rgba(255,255,255,.025);
  font-family: "Playfair Display", Georgia, serif;
  font-size: 130px;
  font-weight: 700;
  letter-spacing: .12em;
  pointer-events: none;
}

/* OPPONENTS */
.opponent {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 12px;
  background: rgba(0,0,0,.2);
  backdrop-filter: blur(10px);
}

.opponent-top { left: 50%; top: 22px; transform: translateX(-50%); }
.opponent-left { left: 25px; top: 42%; }
.opponent-right { right: 285px; top: 42%; }

.opponent-avatar,
.my-avatar {
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(0,0,0,.25);
  border: 1px solid rgba(255,255,255,.1);
  font-weight: 700;
}

.opponent-avatar { width: 35px; height: 35px; font-size: 9px; }
.opponent-details strong { display: block; font-size: 12px; }
.opponent-details small {
  display: block;
  margin-top: 3px;
  color: rgba(255,255,255,.5);
  font-size: 10px;
}

.opponent.is-turn {
  border-color: rgba(215,181,106,.5);
  box-shadow: 0 0 0 1px rgba(215,181,106,.12);
}

/* CENTER */
.center-table {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 41%;
  transform: translate(-50%, -50%);
  width: min(650px, 60%);
  text-align: center;
}

.turn-text {
  min-height: 20px;
  color: rgba(255,255,255,.72);
  font-size: 12px;
}
.played-by {
  min-height: 20px;
  margin-top: 6px;
  color: rgba(255,255,255,.45);
  font-size: 11px;
}
.played-cards {
  min-height: 115px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game-message {
  min-height: 22px;
  margin-top: 8px;
  color: var(--accent);
  font-size: 12px;
}

/* CARDS */
.card {
  position: relative;
  flex: 0 0 auto;
  width: 68px;
  height: 98px;
  margin-left: -17px;
  border-radius: 8px;
  background: linear-gradient(145deg, #ffffff, #ededeb);
  color: #151515;
  box-shadow: 0 7px 18px rgba(0,0,0,.25);
  user-select: none;
  cursor: pointer;
  transition: transform .16s ease, box-shadow .16s ease;
}

.card:first-child { margin-left: 0; }
.card.red { color: var(--red); }
.card:hover { transform: translateY(-9px); }
.card.selected {
  transform: translateY(-22px);
  box-shadow: 0 0 0 2px var(--accent), 0 10px 25px rgba(0,0,0,.35);
}

.card-rank {
  position: absolute;
  left: 7px;
  top: 5px;
  font-size: 17px;
  font-weight: 700;
  line-height: 1;
}
.card-suit {
  position: absolute;
  left: 8px;
  top: 25px;
  font-size: 13px;
}
.card-center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 28px;
}

/* PLAYED CARD MINI */
.played-cards .card {
  width: 58px;
  height: 84px;
  margin-left: -14px;
  cursor: default;
}
.played-cards .card:hover { transform: none; }
.played-cards .card-rank { font-size: 14px; }
.played-cards .card-suit { top: 22px; font-size: 11px; }
.played-cards .card-center { font-size: 23px; }

/* PLAYER */
.my-player {
  position: absolute;
  z-index: 5;
  left: 50%;
  bottom: 15px;
  transform: translateX(-50%);
  width: min(940px, 76%);
}

.my-player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}
.my-player-info { display: flex; align-items: center; gap: 9px; }
.my-avatar { width: 42px; height: 42px; font-size: 10px; }
.my-player-info strong { display: block; font-size: 12px; }
.my-player-info small {
  display: block;
  margin-top: 3px;
  color: rgba(255,255,255,.55);
  font-size: 10px;
}

.turn-badge {
  padding: 6px 9px;
  border-radius: 5px;
  background: rgba(215,181,106,.14);
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .1em;
}
.turn-badge.hidden { visibility: hidden; }

/* HAND */
.hand {
  height: 112px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 2px;
}
.hand .card { width: 67px; height: 96px; }

/* ACTIONS */
.game-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 5px;
}

/* MOVE HISTORY */
.move-history {
  position: absolute;
  z-index: 7;
  top: 28px;
  right: 25px;
  width: 225px;
  max-height: 390px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 13px;
  background: rgba(5,18,13,.72);
  backdrop-filter: blur(14px);
  box-shadow: 0 14px 35px rgba(0,0,0,.16);
}

.history-header {
  padding: 13px 14px 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,.07);
}

.history-kicker {
  color: rgba(255,255,255,.4);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .15em;
}
.history-header h2 {
  margin-top: 2px;
  font-size: 14px;
  font-weight: 600;
}
.history-count {
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: rgba(255,255,255,.07);
  color: var(--muted);
  font-size: 10px;
}

.move-history-list {
  max-height: 325px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.move-history-list::-webkit-scrollbar { width: 4px; }
.move-history-list::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.15);
  border-radius: 4px;
}

.history-empty {
  padding: 24px 14px;
  color: rgba(255,255,255,.35);
  font-size: 11px;
  text-align: center;
}

.move-entry {
  padding: 9px 12px;
  border-bottom: 1px solid rgba(255,255,255,.045);
}
.move-entry:last-child { border-bottom: 0; }
.move-entry.latest { background: rgba(215,181,106,.07); }

.move-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.move-player {
  overflow: hidden;
  color: rgba(255,255,255,.78);
  font-size: 10px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.move-number { color: rgba(255,255,255,.25); font-size: 9px; }

.move-cards {
  min-height: 24px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3px;
}

.mini-card {
  min-width: 25px;
  height: 31px;
  padding: 3px 4px;
  display: inline-flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: 4px;
  background: #f0f0ee;
  color: #111;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}
.mini-card.red { color: var(--red); }

.pass-mark {
  color: rgba(255,255,255,.4);
  font-size: 10px;
  font-style: italic;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0,0,0,.72);
  backdrop-filter: blur(8px);
}
.modal-overlay.show { display: flex; }

.result-modal {
  width: min(400px, 100%);
  padding: 40px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: #111820;
  text-align: center;
  box-shadow: 0 30px 100px rgba(0,0,0,.5);
}
.result-icon { font-size: 45px; color: var(--accent); }
.result-title {
  margin-top: 18px;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 32px;
}
.result-text { margin-top: 8px; color: var(--muted); font-size: 13px; }
.result-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* RESPONSIVE */
@media (max-width: 1050px) {
  .move-history {
    right: 15px;
    width: 195px;
  }
  .opponent-right { right: 225px; }
  .my-player { width: min(820px, 70%); }
}

@media (max-width: 850px) {
  .game-grid { grid-template-columns: 1fr; }
  .home-container { padding-top: 55px; }
  .lobby-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .move-history {
    top: 74px;
    right: 12px;
    width: 185px;
    max-height: 245px;
  }
  .move-history-list { max-height: 180px; }

  .opponent-left,
  .opponent-right { display: none; }

  .center-table {
    width: 75%;
    top: 37%;
  }

  .my-player { width: 94%; }

  .hand {
    height: 100px;
    overflow-x: auto;
    justify-content: flex-start;
    padding-left: 20px;
    padding-right: 20px;
  }

  .hand .card {
    width: 58px;
    height: 84px;
    margin-left: -22px;
  }

  .hand .card:first-child { margin-left: 0; }
  .card-rank { font-size: 14px; }
  .card-suit { top: 22px; font-size: 11px; }
  .card-center { font-size: 22px; }
  .table::before { inset: 15px; border-radius: 25px; }
  .table::after { font-size: 70px; }
}

@media (max-width: 620px) {
  .game-topbar {
    padding: 0 12px;
    grid-template-columns: auto 1fr auto;
  }

  .game-topbar-center {
    justify-content: center;
    gap: 7px;
  }

  .game-room { display: none; }
  .timer-box { min-width: 88px; }
  .timer-label { display: none; }

  .move-history {
    top: 65px;
    right: 10px;
    width: 165px;
    max-height: 205px;
  }
  .move-history-list { max-height: 140px; }

  .history-header { padding: 9px 10px; }
  .history-header h2 { font-size: 12px; }
  .move-entry { padding: 7px 9px; }

  .center-table {
    width: 58%;
    top: 35%;
    left: 39%;
  }

  .played-cards .card {
    width: 48px;
    height: 70px;
    margin-left: -16px;
  }

  .played-cards .card-center { font-size: 19px; }

  .my-player { width: 100%; bottom: 7px; }
  .my-player-header { padding: 0 12px; }
  .turn-badge { display: none; }

  .game-actions { margin-top: 2px; }
  .game-actions .btn { min-height: 40px; }

  .result-modal { padding: 30px 20px; }
  .result-actions { flex-direction: column; }
}

@media (max-width: 430px) {
  .brand { font-size: 19px; }
  .profile-name { display: none; }
  .brand-large { font-size: 40px; }

  .login-card { padding: 45px 25px 30px; }

  .home-container h1,
  .lobby-container h1 { font-size: 43px; }

  .topbar { padding: 0 15px; }

  .move-history {
    width: 150px;
    max-height: 185px;
  }

  .move-history-list { max-height: 120px; }

  .center-table {
    width: 55%;
    left: 38%;
  }
}
