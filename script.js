/* =========================================
   LÌ TÁM — TIẾN LÊN
   Local prototype: 1 player + 3 bots
   New:
   - Timer 30 giây mỗi lượt
   - Tự động bỏ lượt khi hết giờ
   - Lịch sử nước đi
   ========================================= */

"use strict";

const $ = (id) => document.getElementById(id);

const SUITS = [
  { key: "spades", symbol: "♠", red: false },
  { key: "clubs", symbol: "♣", red: false },
  { key: "diamonds", symbol: "♦", red: true },
  { key: "hearts", symbol: "♥", red: true }
];

const RANKS = [
  { key: "3", label: "3", value: 0 },
  { key: "4", label: "4", value: 1 },
  { key: "5", label: "5", value: 2 },
  { key: "6", label: "6", value: 3 },
  { key: "7", label: "7", value: 4 },
  { key: "8", label: "8", value: 5 },
  { key: "9", label: "9", value: 6 },
  { key: "10", label: "10", value: 7 },
  { key: "J", label: "J", value: 8 },
  { key: "Q", label: "Q", value: 9 },
  { key: "K", label: "K", value: 10 },
  { key: "A", label: "A", value: 11 },
  { key: "2", label: "2", value: 12 }
];

const PLAYERS = [
  { id: 0, position: "you", name: "Bạn" },
  { id: 1, position: "top", name: "Minh" },
  { id: 2, position: "left", name: "Khánh" },
  { id: 3, position: "right", name: "Long" }
];

let state = {
  playerName: "Bạn",
  roomId: "LT-000",

  players: [],

  currentPlayer: 0,
  firstPlayer: 0,

  lastPlay: null,
  passCount: 0,

  selectedIds: new Set(),

  history: [],

  timer: null,
  timerSeconds: 30,

  botTimer: null,

  gameOver: false
};


/* =========================================
   LOGIN / NAVIGATION
   ========================================= */

document.addEventListener("DOMContentLoaded", init);

function init() {

  const savedName = localStorage.getItem("litam_username");

  if (savedName) {
    state.playerName = savedName;
    updateProfile();
  }

  $("loginForm").addEventListener("submit", handleLogin);

  $("logoutBtn").addEventListener("click", logout);

  $("tienLenBtn").addEventListener("click", openLobby);

  $("backHomeBtn").addEventListener(
    "click",
    () => showScreen("homeScreen")
  );

  $("createRoomBtn").addEventListener(
    "click",
    createRoom
  );

  $("leaveGameBtn").addEventListener(
    "click",
    leaveGame
  );

  $("playBtn").addEventListener(
    "click",
    playSelected
  );

  $("passBtn").addEventListener(
    "click",
    passTurn
  );

  $("newGameBtn").addEventListener(
    "click",
    () => {

      $("resultModal").classList.remove("show");

      startGame();

    }
  );

  $("resultHomeBtn").addEventListener(
    "click",
    () => {

      $("resultModal").classList.remove("show");

      showScreen("homeScreen");

    }
  );


  if (savedName) {
    showScreen("homeScreen");
  } else {
    showScreen("loginScreen");
  }

  renderRooms();
}


/* =========================================
   LOGIN
   ========================================= */

function handleLogin(event) {

  event.preventDefault();

  const input = $("playerName");

  const name = input.value.trim();

  if (!name) {

    input.focus();

    input.style.borderColor =
      "rgba(216,70,70,.8)";

    return;
  }

  input.style.borderColor = "";

  state.playerName = name;

  localStorage.setItem(
    "litam_username",
    name
  );

  updateProfile();

  showScreen("homeScreen");
}


function logout() {

  stopTurnTimer();

  clearTimeout(state.botTimer);

  localStorage.removeItem(
    "litam_username"
  );

  state.playerName = "Bạn";

  $("playerName").value = "";

  showScreen("loginScreen");
}


function updateProfile() {

  const name =
    state.playerName || "Bạn";

  $("homePlayerName").textContent = name;

  $("gamePlayerName").textContent = name;

  $("profileInitial").textContent =
    initials(name);

  $("myInitial").textContent =
    initials(name);
}


function initials(name) {

  const parts =
    String(name)
      .trim()
      .split(/\s+/);

  if (!parts.length) {
    return "B";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}


function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach((screen) => {

      screen.classList.toggle(
        "active",
        screen.id === id
      );

    });
}


/* =========================================
   ROOMS
   ========================================= */

function getRooms() {

  try {

    const rooms =
      JSON.parse(
        localStorage.getItem(
          "litam_rooms"
        ) || "null"
      );

    return Array.isArray(rooms)
      ? rooms
      : [];

  } catch {

    return [];

  }
}


function saveRooms(rooms) {

  localStorage.setItem(
    "litam_rooms",
    JSON.stringify(
      rooms.slice(-20)
    )
  );

}


function seedRooms() {

  const existing = getRooms();

  if (existing.length) {
    return existing;
  }

  const rooms = [

    {
      id: "LT-001",
      host: "Minh",
      players: 2,
      maxPlayers: 4
    },

    {
      id: "LT-002",
      host: "Khánh",
      players: 1,
      maxPlayers: 4
    },

    {
      id: "LT-003",
      host: "Long",
      players: 3,
      maxPlayers: 4
    }

  ];

  saveRooms(rooms);

  return rooms;
}


function renderRooms() {

  const list = $("roomList");

  if (!list) {
    return;
  }

  let rooms = getRooms();

  if (!rooms.length) {
    rooms = seedRooms();
  }

  list.innerHTML = "";

  rooms.forEach((room) => {

    const row =
      document.createElement("div");

    row.className = "room";


    const left =
      document.createElement("div");

    left.className = "room-left";


    const strong =
      document.createElement("strong");

    strong.textContent = room.id;


    const span =
      document.createElement("span");

    span.textContent =
      `${room.host} · ${room.players}/${room.maxPlayers} người chơi`;


    left.append(
      strong,
      span
    );


    const right =
      document.createElement("div");

    right.className =
      "room-right";


    const status =
      document.createElement("span");

    status.className =
      "room-status";

    status.textContent =
      room.players >= room.maxPlayers
        ? "ĐẦY"
        : "ĐANG CHỜ";


    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "btn btn-secondary join-room-btn";

    button.dataset.room =
      room.id;

    button.textContent =
      "THAM GIA";

    button.disabled =
      room.players >= room.maxPlayers;


    right.append(
      status,
      button
    );

    row.append(
      left,
      right
    );

    list.appendChild(row);

  });
}


function openLobby() {

  renderRooms();

  showScreen(
    "lobbyScreen"
  );
}


function createRoom() {

  const roomId =
    makeRoomId();

  const room = {

    id: roomId,

    host:
      state.playerName,

    players: 1,

    maxPlayers: 4

  };


  const rooms =
    getRooms();

  rooms.push(room);

  saveRooms(rooms);

  openRoom(roomId);
}


function makeRoomId() {

  let id;

  const rooms =
    getRooms();

  do {

    id =
      "LT-" +
      Math.floor(
        100 +
        Math.random() * 900
      );

  } while (
    rooms.some(
      (room) =>
        room.id === id
    )
  );

  return id;
}


function openRoom(roomId) {

  state.roomId =
    roomId;

  localStorage.setItem(
    "litam_current_room",
    roomId
  );

  startGame();

  showScreen(
    "gameScreen"
  );
}


/* =========================================
   JOIN ROOM
   ========================================= */

document.addEventListener(
  "click",
  (event) => {

    const button =
      event.target.closest(
        ".join-room-btn"
      );

    if (!button) {
      return;
    }

    const roomId =
      button.dataset.room;

    if (roomId) {
      openRoom(roomId);
    }

  }
);


/* =========================================
   DECK
   ========================================= */

function createDeck() {

  const deck = [];

  SUITS.forEach((suit) => {

    RANKS.forEach((rank) => {

      deck.push({

        id:
          `${rank.key}-${suit.key}`,

        rank:
          rank.key,

        rankValue:
          rank.value,

        suit:
          suit.key,

        suitSymbol:
          suit.symbol,

        red:
          suit.red

      });

    });

  });

  return deck;
}


function shuffle(deck) {

  const copy =
    [...deck];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      copy[i],
      copy[j]
    ] = [
      copy[j],
      copy[i]
    ];

  }

  return copy;
}


function sortCards(cards) {

  return [...cards].sort(
    (a, b) => {

      if (
        a.rankValue !==
        b.rankValue
      ) {

        return (
          a.rankValue -
          b.rankValue
        );

      }

      return (
        suitOrder(a.suit) -
        suitOrder(b.suit)
      );

    }
  );
}


function suitOrder(suit) {

  return {
    spades: 0,
    clubs: 1,
    diamonds: 2,
    hearts: 3
  }[suit] ?? 0;
}


/* =========================================
   START GAME
   ========================================= */

function startGame() {

  stopTurnTimer();

  clearTimeout(
    state.botTimer
  );


  const deck =
    shuffle(
      createDeck()
    );


  state.players = [

    {
      ...PLAYERS[0],
      name: state.playerName,
      hand: []
    },

    {
      ...PLAYERS[1],
      hand: []
    },

    {
      ...PLAYERS[2],
      hand: []
    },

    {
      ...PLAYERS[3],
      hand: []
    }

  ];


  for (
    let i = 0;
    i < 52;
    i++
  ) {

    state.players[
      i % 4
    ].hand.push(
      deck[i]
    );

  }


  state.players.forEach(
    (player) => {

      player.hand =
        sortCards(
          player.hand
        );

    }
  );


  state.firstPlayer =
    state.players.findIndex(
      (player) =>

        player.hand.some(
          (card) =>

            card.rank === "3" &&
            card.suit === "spades"

        )

    );


  if (
    state.firstPlayer < 0
  ) {

    state.firstPlayer = 0;

  }


  state.currentPlayer =
    state.firstPlayer;


  state.lastPlay = null;

  state.passCount = 0;

  state.selectedIds =
    new Set();

  state.history = [];

  state.gameOver = false;

  state.timerSeconds = 30;


  $("roomIdText").textContent =
    state.roomId;

  $("resultModal")
    .classList
    .remove("show");


  updateProfile();

  renderAll();

  beginTurn();
}


/* =========================================
   TURN
   ========================================= */

function beginTurn() {

  stopTurnTimer();

  clearTimeout(
    state.botTimer
  );


  if (state.gameOver) {
    return;
  }


  state.timerSeconds = 30;

  updateTimerUI();


  if (
    state.currentPlayer === 0
  ) {

    setMessage(
      "Bạn có 30 giây để đánh."
    );

    startTurnTimer();

  } else {

    setMessage(
      `${state.players[state.currentPlayer].name} đang suy nghĩ...`
    );


    state.botTimer =
      setTimeout(
        () => {

          if (
            !state.gameOver &&
            state.currentPlayer !== 0
          ) {

            botMove(
              state.currentPlayer
            );

          }

        },
        900
      );

  }


  renderTurnState();
}


/* =========================================
   30 SECOND TIMER
   ========================================= */

function startTurnTimer() {

  state.timerSeconds = 30;

  updateTimerUI();


  state.timer =
    setInterval(
      () => {

        state.timerSeconds -= 1;


        if (
          state.timerSeconds < 0
        ) {

          state.timerSeconds = 0;

        }


        updateTimerUI();


        if (
          state.timerSeconds === 0
        ) {

          stopTurnTimer();


          if (
            state.currentPlayer === 0 &&
            !state.gameOver
          ) {

            setMessage(
              "Hết 30 giây — tự động bỏ lượt."
            );


            setTimeout(
              () => {

                if (
                  !state.gameOver &&
                  state.currentPlayer === 0
                ) {

                  passTurn(true);

                }

              },
              250
            );

          }

        }

      },
      1000
    );
}


function stopTurnTimer() {

  if (state.timer) {

    clearInterval(
      state.timer
    );

    state.timer = null;

  }
}


function updateTimerUI() {

  const timer =
    $("turnTimer");

  const box =
    $("timerBox");


  if (!timer || !box) {
    return;
  }


  timer.textContent =
    String(
      state.timerSeconds
    );


  box.classList.toggle(
    "warning",
    state.timerSeconds <= 10
  );


  box.classList.toggle(
    "danger",
    state.timerSeconds <= 5
  );


  timer.setAttribute(
    "aria-label",
    `Còn ${state.timerSeconds} giây`
  );
}


/* =========================================
   HUMAN CARD SELECTION
   ========================================= */

function toggleCard(cardId) {

  if (
    state.currentPlayer !== 0 ||
    state.gameOver
  ) {

    return;

  }


  if (
    state.selectedIds.has(
      cardId
    )
  ) {

    state.selectedIds.delete(
      cardId
    );

  } else {

    state.selectedIds.add(
      cardId
    );

  }


  renderHand();
}


function getSelectedCards(
  playerIndex = 0
) {

  const player =
    state.players[
      playerIndex
    ];

  if (!player) {
    return [];
  }


  return sortCards(

    player.hand.filter(
      (card) =>
        state.selectedIds.has(
          card.id
        )
    )

  );
}


/* =========================================
   PLAY SELECTED
   ========================================= */

function playSelected() {

  if (
    state.gameOver ||
    state.currentPlayer !== 0
  ) {

    return;

  }


  const cards =
    getSelectedCards(0);


  if (!cards.length) {

    setMessage(
      "Hãy chọn ít nhất một quân bài."
    );

    return;

  }


  const move =
    analyzeMove(cards);


  if (!move) {

    setMessage(
      "Bộ bài đã chọn không hợp lệ."
    );

    return;

  }


  if (
    !canBeat(
      move,
      state.lastPlay
    )
  ) {

    setMessage(
      "Bộ bài này không thể chặn lượt hiện tại."
    );

    return;

  }


  executePlay(
    0,
    cards,
    move
  );
}


/* =========================================
   PASS
   ========================================= */

function passTurn(auto = false) {

  if (
    state.gameOver ||
    state.currentPlayer !== 0
  ) {

    return;

  }


  if (!state.lastPlay) {

    setMessage(
      "Bạn đang giữ lượt đầu tiên, không thể bỏ."
    );

    return;

  }


  stopTurnTimer();

  state.selectedIds.clear();


  addHistory(
    0,
    [],
    true,
    auto
  );


  state.passCount += 1;


  if (
    state.passCount >= 3
  ) {

    resetTrickAfterPasses();

    return;

  }


  state.currentPlayer =
    nextPlayer(
      state.currentPlayer
    );


  renderAll();

  beginTurn();
}


/* =========================================
   EXECUTE PLAY
   ========================================= */

function executePlay(
  playerIndex,
  cards,
  move
) {

  stopTurnTimer();

  clearTimeout(
    state.botTimer
  );


  const player =
    state.players[
      playerIndex
    ];


  player.hand =
    player.hand.filter(
      (card) =>

        !cards.some(
          (played) =>
            played.id ===
            card.id
        )

    );


  state.lastPlay = {

    player:
      playerIndex,

    cards:
      [...cards],

    move

  };


  state.passCount = 0;

  state.selectedIds.clear();


  addHistory(
    playerIndex,
    cards,
    false,
    false
  );


  renderAll();


  if (
    player.hand.length === 0
  ) {

    finishGame(
      playerIndex
    );

    return;

  }


  state.currentPlayer =
    nextPlayer(
      playerIndex
    );


  beginTurn();
}


/* =========================================
   RESET TRICK
   ========================================= */

function resetTrickAfterPasses() {

  const lastPlayer =
    state.lastPlay
      ? state.lastPlay.player
      : state.currentPlayer;


  state.lastPlay = null;

  state.passCount = 0;

  state.currentPlayer =
    lastPlayer;


  setMessage(
    `${state.players[lastPlayer].name} được mở lượt mới.`
  );


  renderAll();

  beginTurn();
}


/* =========================================
   BOT
   ========================================= */

function botMove(playerIndex) {

  if (
    state.gameOver ||
    state.currentPlayer !== playerIndex
  ) {

    return;

  }


  const player =
    state.players[
      playerIndex
    ];


  const move =
    chooseBotMove(
      player.hand,
      state.lastPlay
    );


  if (!move) {

    if (state.lastPlay) {

      addHistory(
        playerIndex,
        [],
        true,
        false
      );


      state.passCount += 1;


      if (
        state.passCount >= 3
      ) {

        resetTrickAfterPasses();

      } else {

        state.currentPlayer =
          nextPlayer(
            playerIndex
          );

        renderAll();

        beginTurn();

      }

    } else {

      const single = [
        player.hand[0]
      ];

      executePlay(
        playerIndex,
        single,
        analyzeMove(single)
      );

    }

    return;
  }


  executePlay(
    playerIndex,
    move.cards,
    move
  );
}


/* =========================================
   BOT MOVE CHOICE
   ========================================= */

function chooseBotMove(
  hand,
  lastPlay
) {

  const cards =
    sortCards(hand);


  if (!lastPlay) {

    return cards.length
      ? analyzeMove([
          cards[0]
        ])
      : null;

  }


  const target =
    lastPlay.move;


  const candidates =
    generateCandidates(
      cards,
      target
    );


  for (
    const candidate of candidates
  ) {

    if (
      canBeat(
        candidate,
        lastPlay
      )
    ) {

      return candidate;

    }

  }


  const specialCandidates =
    generateSpecialCandidates(
      cards
    );


  for (
    const candidate of specialCandidates
  ) {

    if (
      canBeat(
        candidate,
        lastPlay
      )
    ) {

      return candidate;

    }

  }


  return null;
}


/* =========================================
   GENERATE CANDIDATES
   ========================================= */

function generateCandidates(
  cards,
  target
) {

  const result = [];

  const count =
    target.count;


  if (count === 1) {

    cards.forEach(
      (card) => {

        result.push(
          analyzeMove([
            card
          ])
        );

      }
    );

  }


  else if (count === 2) {

    const groups =
      groupByRank(cards);

    Object.values(groups)
      .forEach(
        (group) => {

          if (
            group.length >= 2
          ) {

            result.push(
              analyzeMove(
                group.slice(0, 2)
              )
            );

          }

        }
      );

  }


  else if (count === 3) {

    const groups =
      groupByRank(cards);

    Object.values(groups)
      .forEach(
        (group) => {

          if (
            group.length >= 3
          ) {

            result.push(
              analyzeMove(
                group.slice(0, 3)
              )
            );

          }

        }
      );

  }


  else if (count === 4) {

    const groups =
      groupByRank(cards);

    Object.values(groups)
      .forEach(
        (group) => {

          if (
            group.length >= 4
          ) {

            result.push(
              analyzeMove(
                group.slice(0, 4)
              )
            );

          }

        }
      );

  }


  else if (
    target.type === "straight"
  ) {

    result.push(
      ...generateStraights(
        cards,
        count
      )
    );

  }


  else if (
    target.type === "threePairs"
  ) {

    result.push(
      ...generateConsecutivePairs(
        cards,
        3
      )
    );

  }


  else if (
    target.type === "fourPairs"
  ) {

    result.push(
      ...generateConsecutivePairs(
        cards,
        4
      )
    );

  }


  return result
    .filter(Boolean)
    .sort(
      (a, b) =>
        a.highValue -
        b.highValue
    );
}


/* =========================================
   SPECIAL MOVES
   ========================================= */

function generateSpecialCandidates(
  cards
) {

  const result = [];

  const groups =
    groupByRank(cards);


  Object.values(groups)
    .forEach(
      (group) => {

        if (
          group.length >= 4
        ) {

          result.push(
            analyzeMove(
              group.slice(0, 4)
            )
          );

        }

      }
    );


  result.push(
    ...generateConsecutivePairs(
      cards,
      3
    )
  );


  result.push(
    ...generateConsecutivePairs(
      cards,
      4
    )
  );


  return result.filter(Boolean);
}


/* =========================================
   STRAIGHTS
   ========================================= */

function generateStraights(
  cards,
  length
) {

  const groups =
    groupByRank(cards);


  const ranks =
    Object.keys(groups)
      .map(Number)
      .filter(
        (value) =>
          value < 12
      )
      .sort(
        (a, b) => a - b
      );


  const result = [];


  for (
    let i = 0;
    i <= ranks.length - length;
    i++
  ) {

    let valid = true;


    for (
      let j = 1;
      j < length;
      j++
    ) {

      if (
        ranks[i + j] !==
        ranks[i] + j
      ) {

        valid = false;

        break;

      }

    }


    if (valid) {

      const selected = [];


      for (
        let j = 0;
        j < length;
        j++
      ) {

        selected.push(
          groups[
            ranks[i + j]
          ][0]
        );

      }


      result.push(
        analyzeMove(
          selected
        )
      );

    }

  }


  return result;
}


/* =========================================
   CONSECUTIVE PAIRS
   ========================================= */

function generateConsecutivePairs(
  cards,
  pairCount
) {

  const groups =
    groupByRank(cards);


  const ranks =
    Object.keys(groups)
      .map(Number)
      .filter(
        (value) =>
          value < 12 &&
          groups[value].length >= 2
      )
      .sort(
        (a, b) => a - b
      );


  const result = [];


  for (
    let i = 0;
    i <= ranks.length - pairCount;
    i++
  ) {

    let valid = true;


    for (
      let j = 1;
      j < pairCount;
      j++
    ) {

      if (
        ranks[i + j] !==
        ranks[i] + j
      ) {

        valid = false;

        break;

      }

    }


    if (valid) {

      const selected = [];


      for (
        let j = 0;
        j < pairCount;
        j++
      ) {

        selected.push(
          ...groups[
            ranks[i + j]
          ].slice(0, 2)
        );

      }


      result.push(
        analyzeMove(
          selected
        )
      );

    }

  }


  return result;
}


/* =========================================
   ANALYZE MOVE
   ========================================= */

function analyzeMove(cards) {

  const sorted =
    sortCards(cards);

  const count =
    sorted.length;


  if (!count) {
    return null;
  }


  const groups =
    groupByRank(sorted);


  const sizes =
    Object.values(groups)
      .map(
        (group) =>
          group.length
      )
      .sort(
        (a, b) => a - b
      );


  const uniqueRanks =
    Object.keys(groups)
      .map(Number)
      .sort(
        (a, b) => a - b
      );


  if (count === 1) {

    return {

      type: "single",

      count: 1,

      highValue:
        sorted[0].rankValue,

      cards: sorted

    };

  }


  if (
    count === 2 &&
    sizes.length === 1 &&
    sizes[0] === 2
  ) {

    return {

      type: "pair",

      count: 2,

      highValue:
        uniqueRanks[0],

      cards: sorted

    };

  }


  if (
    count === 3 &&
    sizes.length === 1 &&
    sizes[0] === 3
  ) {

    return {

      type: "triple",

      count: 3,

      highValue:
        uniqueRanks[0],

      cards: sorted

    };

  }


  if (
    count === 4 &&
    sizes.length === 1 &&
    sizes[0] === 4
  ) {

    return {

      type: "four",

      count: 4,

      highValue:
        uniqueRanks[0],

      cards: sorted

    };

  }


  if (
    count >= 3 &&
    isStraight(sorted)
  ) {

    return {

      type: "straight",

      count,

      highValue:
        sorted[
          sorted.length - 1
        ].rankValue,

      cards: sorted

    };

  }


  if (
    count >= 6 &&
    count % 2 === 0 &&
    isConsecutivePairs(sorted)
  ) {

    const pairCount =
      count / 2;


    return {

      type:
        pairCount === 3
          ? "threePairs"
          : "fourPairs",

      count,

      highValue:
        sorted[
          sorted.length - 1
        ].rankValue,

      cards: sorted

    };

  }


  return null;
}


/* =========================================
   STRAIGHT CHECK
   ========================================= */

function isStraight(cards) {

  if (cards.length < 3) {
    return false;
  }


  const values =
    cards.map(
      (card) =>
        card.rankValue
    );


  if (
    values.some(
      (value) =>
        value === 12
    )
  ) {

    return false;

  }


  for (
    let i = 1;
    i < values.length;
    i++
  ) {

    if (
      values[i] !==
      values[i - 1] + 1
    ) {

      return false;

    }

  }


  return (
    new Set(values).size ===
    values.length
  );
}


/* =========================================
   CONSECUTIVE PAIRS CHECK
   ========================================= */

function isConsecutivePairs(
  cards
) {

  const groups =
    groupByRank(cards);


  const ranks =
    Object.keys(groups)
      .map(Number)
      .sort(
        (a, b) => a - b
      );


  if (!ranks.length) {
    return false;
  }


  if (
    ranks.some(
      (rank) =>
        rank === 12
    )
  ) {

    return false;

  }


  if (
    Object.values(groups)
      .some(
        (group) =>
          group.length !== 2
      )
  ) {

    return false;

  }


  for (
    let i = 1;
    i < ranks.length;
    i++
  ) {

    if (
      ranks[i] !==
      ranks[i - 1] + 1
    ) {

      return false;

    }

  }


  return true;
}


/* =========================================
   CAN BEAT
   ========================================= */

function canBeat(
  move,
  previous
) {

  if (!previous) {
    return true;
  }


  const target =
    previous.move;


  if (
    move.type === target.type &&
    move.count === target.count
  ) {

    return (
      move.highValue >
      target.highValue
    );

  }


  /*
    Tứ quý có thể chặt 2
  */

  if (
    move.type === "four"
  ) {

    if (
      target.type === "single" &&
      target.highValue === 12
    ) {

      return true;

    }


    if (
      target.type === "pair" &&
      target.highValue === 12
    ) {

      return true;

    }

  }


  /*
    3 đôi thông / 4 đôi thông
    chặt 2
  */

  if (
    (
      move.type === "threePairs" ||
      move.type === "fourPairs"
    ) &&
    target.type === "single" &&
    target.highValue === 12
  ) {

    return true;

  }


  return false;
}


/* =========================================
   GROUP BY RANK
   ========================================= */

function groupByRank(cards) {

  return cards.reduce(
    (groups, card) => {

      if (
        !groups[
          card.rankValue
        ]
      ) {

        groups[
          card.rankValue
        ] = [];

      }


      groups[
        card.rankValue
      ].push(card);


      return groups;

    },
    {}
  );
}


function nextPlayer(index) {

  return (
    (index + 1) % 4
  );
}


/* =========================================
   MOVE HISTORY
   ========================================= */

function addHistory(
  playerIndex,
  cards,
  isPass,
  auto
) {

  state.history.push({

    player:
      playerIndex,

    cards:
      [...cards],

    isPass,

    auto,

    number:
      state.history.length + 1

  });


  renderHistory();
}


function renderHistory() {

  const list =
    $("moveHistory");

  const count =
    $("historyCount");


  if (!list || !count) {
    return;
  }


  count.textContent =
    String(
      state.history.length
    );


  if (
    !state.history.length
  ) {

    list.innerHTML =
      '<div class="history-empty">Chưa có nước đi</div>';

    return;
  }


  list.innerHTML = "";


  state.history.forEach(
    (entry, index) => {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "move-entry" +
        (
          index ===
          state.history.length - 1
            ? " latest"
            : ""
        );


      const top =
        document.createElement(
          "div"
        );

      top.className =
        "move-top";


      const player =
        document.createElement(
          "span"
        );

      player.className =
        "move-player";

      player.textContent =
        state.players[
          entry.player
        ]?.name ||
        `P${entry.player + 1}`;


      const number =
        document.createElement(
          "span"
        );

      number.className =
        "move-number";

      number.textContent =
        entry.number;


      top.append(
        player,
        number
      );


      const cards =
        document.createElement(
          "div"
        );

      cards.className =
        "move-cards";


      if (entry.isPass) {

        const pass =
          document.createElement(
            "span"
          );

        pass.className =
          "pass-mark";

        pass.textContent =
          entry.auto
            ? "BỎ LƯỢT · 30s"
            : "BỎ LƯỢT";

        cards.appendChild(
          pass
        );

      } else {

        entry.cards.forEach(
          (card) => {

            const mini =
              document.createElement(
                "span"
              );

            mini.className =
              "mini-card" +
              (
                card.red
                  ? " red"
                  : ""
              );

            mini.textContent =
              `${card.rank}${card.suitSymbol}`;

            cards.appendChild(
              mini
            );

          }
        );

      }


      row.append(
        top,
        cards
      );

      list.appendChild(row);

    }
  );


  list.scrollTop =
    list.scrollHeight;
}


/* =========================================
   RENDER
   ========================================= */

function renderAll() {

  renderPlayers();

  renderHand();

  renderCenter();

  renderHistory();

  updateTimerUI();

  renderTurnState();
}


/* =========================================
   PLAYERS
   ========================================= */

function renderPlayers() {

  const mapping = [

    {
      element: $("player2"),
      playerIndex: 1
    },

    {
      element: $("player3"),
      playerIndex: 2
    },

    {
      element: $("player4"),
      playerIndex: 3
    }

  ];


  mapping.forEach(
    ({
      element,
      playerIndex
    }) => {

      if (!element) {
        return;
      }


      const player =
        state.players[
          playerIndex
        ];


      const strong =
        element.querySelector(
          "strong"
        );


      const small =
        element.querySelector(
          "small"
        );


      if (strong) {

        strong.textContent =
          player.name;

      }


      if (small) {

        small.textContent =
          `${player.hand.length} lá`;

      }


      element.classList.toggle(
        "is-turn",
        state.currentPlayer ===
        playerIndex
      );

    }
  );


  $("myCardCount").textContent =
    `${state.players[0].hand.length} lá`;
}


/* =========================================
   HAND
   ========================================= */

function renderHand() {

  const hand =
    $("myHand");


  if (
    !hand ||
    !state.players[0]
  ) {

    return;

  }


  hand.innerHTML = "";


  state.players[0].hand
    .forEach(
      (card) => {

        const element =
          createCardElement(
            card
          );


        element.classList.toggle(
          "selected",
          state.selectedIds.has(
            card.id
          )
        );


        element.addEventListener(
          "click",
          () =>
            toggleCard(
              card.id
            )
        );


        hand.appendChild(
          element
        );

      }
    );
}


/* =========================================
   CENTER PLAY
   ========================================= */

function renderCenter() {

  const turnText =
    $("turnText");

  const playedBy =
    $("playedBy");

  const playedCards =
    $("playedCards");


  if (
    !turnText ||
    !playedBy ||
    !playedCards
  ) {

    return;

  }


  const current =
    state.players[
      state.currentPlayer
    ];


  if (current) {

    turnText.textContent =

      state.currentPlayer === 0

        ? "Đến lượt của bạn"

        : `Đến lượt của ${current.name}`;

  }


  playedCards.innerHTML = "";


  if (!state.lastPlay) {

    playedBy.textContent =
      "Chưa có nước đi";

    return;

  }


  const player =
    state.players[
      state.lastPlay.player
    ];


  playedBy.textContent =
    `Bài của ${player.name}`;


  state.lastPlay.cards
    .forEach(
      (card) => {

        const element =
          createCardElement(
            card
          );


        element.classList.add(
          "played-card"
        );


        playedCards.appendChild(
          element
        );

      }
    );
}


/* =========================================
   TURN STATE
   ========================================= */

function renderTurnState() {

  const isMyTurn =
    state.currentPlayer === 0 &&
    !state.gameOver;


  $("myTurnBadge")
    .classList
    .toggle(
      "hidden",
      !isMyTurn
    );


  $("playBtn").disabled =
    !isMyTurn;


  $("passBtn").disabled =
    !isMyTurn ||
    !state.lastPlay;


  if (!isMyTurn) {

    $("turnTimer").textContent =
      "—";

    $("timerBox")
      .classList
      .remove(
        "warning",
        "danger"
      );

  } else {

    updateTimerUI();

  }
}


/* =========================================
   CREATE CARD
   ========================================= */

function createCardElement(card) {

  const element =
    document.createElement(
      "div"
    );


  element.className =
    "card" +
    (
      card.red
        ? " red"
        : ""
    );


  element.dataset.cardId =
    card.id;


  const rank =
    document.createElement(
      "div"
    );

  rank.className =
    "card-rank";

  rank.textContent =
    card.rank;


  const suit =
    document.createElement(
      "div"
    );

  suit.className =
    "card-suit";

  suit.textContent =
    card.suitSymbol;


  const center =
    document.createElement(
      "div"
    );

  center.className =
    "card-center";

  center.textContent =
    card.suitSymbol;


  element.append(
    rank,
    suit,
    center
  );


  return element;
}


/* =========================================
   MESSAGE
   ========================================= */

function setMessage(message) {

  const element =
    $("message");

  if (element) {

    element.textContent =
      message;

  }
}


/* =========================================
   RESULT
   ========================================= */

function finishGame(
  playerIndex
) {

  state.gameOver = true;

  stopTurnTimer();

  clearTimeout(
    state.botTimer
  );


  const winner =
    state.players[
      playerIndex
    ];


  const humanWon =
    playerIndex === 0;


  $("resultTitle").textContent =

    humanWon

      ? "Bạn thắng!"

      : `${winner.name} thắng!`;


  $("resultText").textContent =

    humanWon

      ? "Bạn đã đánh hết 13 lá."

      : `${winner.name} đã đánh hết bài trước bạn.`;


  $("resultModal")
    .classList
    .add("show");


  renderAll();
}


/* =========================================
   LEAVE GAME
   ========================================= */

function leaveGame() {

  stopTurnTimer();

  clearTimeout(
    state.botTimer
  );


  state.gameOver = true;


  showScreen(
    "lobbyScreen"
  );


  renderRooms();
}


/* =========================================
   GLOBAL
   ========================================= */

window.startGame =
  startGame;

window.showScreen =
  showScreen;

window.toggleCard =
  toggleCard;
