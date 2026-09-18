/* ==========================================
   LÌ TÁM — TIẾN LÊN MVP
   ========================================== */

const suits = [
  { id: "spades", symbol: "♠", name: "Bích", color: "black" },
  { id: "clubs", symbol: "♣", name: "Tép", color: "black" },
  { id: "diamonds", symbol: "♦", name: "Rô", color: "red" },
  { id: "hearts", symbol: "♥", name: "Cơ", color: "red" }
];

const ranks = [
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "J" },
  { value: 12, label: "Q" },
  { value: 13, label: "K" },
  { value: 14, label: "A" },
  { value: 15, label: "2" }
];

let playerName = "";
let currentRoom = null;
let game = null;

/* ==========================================
   SCREEN
   ========================================== */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

/* ==========================================
   LOGIN
   ========================================== */

document.getElementById("loginBtn").addEventListener("click", () => {

  const input = document.getElementById("playerName");
  const name = input.value.trim();

  if (!name) {
    input.focus();
    return;
  }

  playerName = name;

  localStorage.setItem("liTamPlayerName", playerName);

  document.getElementById("homePlayerName").textContent = playerName;

  showScreen("homeScreen");
});


/* ==========================================
   LOGOUT
   ========================================== */

document.getElementById("logoutBtn").addEventListener("click", () => {

  localStorage.removeItem("liTamPlayerName");

  playerName = "";

  document.getElementById("playerName").value = "";

  showScreen("loginScreen");
});


/* ==========================================
   HOME
   ========================================== */

document.getElementById("tienLenBtn").addEventListener("click", () => {

  renderRooms();

  showScreen("lobbyScreen");

});


document.getElementById("backHomeBtn").addEventListener("click", () => {

  showScreen("homeScreen");

});


/* ==========================================
   ROOMS
   ========================================== */

let rooms = [
  {
    id: "LT-001",
    players: 1,
    maxPlayers: 4
  },
  {
    id: "LT-002",
    players: 2,
    maxPlayers: 4
  }
];


function renderRooms() {

  const container = document.getElementById("roomList");

  container.innerHTML = "";

  rooms.forEach(room => {

    const div = document.createElement("div");

    div.className = "room";

    div.innerHTML = `
      <div class="room-info-left">
        <strong>Phòng ${room.id}</strong>
        <span>${room.players}/${room.maxPlayers} người chơi</span>
      </div>

      <button class="secondary-btn">
        THAM GIA
      </button>
    `;

    div.querySelector("button").addEventListener("click", () => {
      joinRoom(room);
    });

    container.appendChild(div);

  });

}


/* ==========================================
   CREATE ROOM
   ========================================== */

document.getElementById("createRoomBtn").addEventListener("click", () => {

  const id =
    "LT-" +
    Math.floor(100 + Math.random() * 900);

  const room = {
    id,
    players: 1,
    maxPlayers: 4
  };

  rooms.push(room);

  joinRoom(room);

});


/* ==========================================
   JOIN ROOM
   ========================================== */

function joinRoom(room) {

  currentRoom = room;

  document.getElementById("roomIdText").textContent =
    room.id;

  document.getElementById("gamePlayerName").textContent =
    playerName;

  startGame();

  showScreen("gameScreen");

}


/* ==========================================
   CREATE DECK
   ========================================== */

function createDeck() {

  const deck = [];

  ranks.forEach(rank => {

    suits.forEach(suit => {

      deck.push({
        id: `${rank.label}_${suit.id}`,
        rank: rank.value,
        label: rank.label,
        suit: suit.symbol,
        suitId: suit.id,
        color: suit.color
      });

    });

  });

  return deck;
}


/* ==========================================
   SHUFFLE
   ========================================== */

function shuffle(deck) {

  const array = [...deck];

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
      [array[j], array[i]];

  }

  return array;
}


/* ==========================================
   START GAME
   ========================================== */

function startGame() {

  let deck = shuffle(createDeck());

  const playerHand = deck.splice(0, 13);

  playerHand.sort(compareCards);

  game = {

    deck,

    players: [

      {
        name: playerName,
        hand: playerHand
      },

      {
        name: "Player 2",
        hand: deck.splice(0, 13)
      },

      {
        name: "Player 3",
        hand: deck.splice(0, 13)
      },

      {
        name: "Player 4",
        hand: deck.splice(0, 13)
      }

    ],

    currentPlayer: 0,

    table: [],

    selected: [],

    lastPlayer: null

  };

  renderGame();

  setMessage("Bạn đi trước.");

}


/* ==========================================
   CARD SORT
   ========================================== */

function compareCards(a, b) {

  if (a.rank !== b.rank) {
    return a.rank - b.rank;
  }

  return suitPower(a) - suitPower(b);

}


function suitPower(card) {

  const powers = {
    spades: 1,
    clubs: 2,
    diamonds: 3,
    hearts: 4
  };

  return powers[card.suitId];

}


/* ==========================================
   RENDER GAME
   ========================================== */

function renderGame() {

  if (!game) return;

  renderHand();

  document.getElementById("myCardCount").textContent =
    `${game.players[0].hand.length} lá`;

  document.getElementById("p2Count").textContent =
    `${game.players[1].hand.length} lá`;

  document.getElementById("p3Count").textContent =
    `${game.players[2].hand.length} lá`;

  document.getElementById("p4Count").textContent =
    `${game.players[3].hand.length} lá`;

  renderPlayedCards();

  const turnName =
    game.players[game.currentPlayer].name;

  document.getElementById("turnText").textContent =
    `Lượt của ${turnName}`;

}


/* ==========================================
   RENDER PLAYER HAND
   ========================================== */

function renderHand() {

  const handContainer =
    document.getElementById("myHand");

  handContainer.innerHTML = "";

  game.players[0].hand.forEach(card => {

    const cardElement =
      createCardElement(card);

    if (
      game.selected.some(
        selected => selected.id === card.id
      )
    ) {

      cardElement.classList.add("selected");

    }

    cardElement.addEventListener("click", () => {

      toggleCard(card);

    });

    handContainer.appendChild(cardElement);

  });

}


/* ==========================================
   CREATE CARD
   ========================================== */

function createCardElement(card) {

  const div = document.createElement("div");

  div.className = "card";

  if (card.color === "red") {
    div.classList.add("red");
  }

  div.innerHTML = `
    <div class="card-rank">
      ${card.label}
    </div>

    <div class="card-suit">
      ${card.suit}
    </div>

    <div class="card-center">
      ${card.suit}
    </div>
  `;

  return div;

}


/* ==========================================
   SELECT CARD
   ========================================== */

function toggleCard(card) {

  const index =
    game.selected.findIndex(
      selected => selected.id === card.id
    );

  if (index >= 0) {

    game.selected.splice(index, 1);

  } else {

    game.selected.push(card);

  }

  game.selected.sort(compareCards);

  renderHand();

}


/* ==========================================
   PLAY CARD
   ========================================== */

document.getElementById("playBtn").addEventListener("click", () => {

  if (game.currentPlayer !== 0) {

    setMessage("Chưa đến lượt của bạn.");

    return;

  }

  if (game.selected.length === 0) {

    setMessage("Hãy chọn lá bài.");

    return;

  }

  if (!isValidMove(game.selected, game.table)) {

    setMessage("Nước đi không hợp lệ.");

    return;

  }

  const selectedIds =
    game.selected.map(card => card.id);

  game.players[0].hand =
    game.players[0].hand.filter(
      card => !selectedIds.includes(card.id)
    );

  game.table = [...game.selected];

  game.lastPlayer = 0;

  game.selected = [];

  renderGame();

  if (game.players[0].hand.length === 0) {

    endGame();

    return;

  }

  nextTurn();

});


/* ==========================================
   PASS
   ========================================== */

document.getElementById("passBtn").addEventListener("click", () => {

  if (game.currentPlayer !== 0) {

    setMessage("Chưa đến lượt của bạn.");

    return;

  }

  if (game.table.length === 0) {

    setMessage("Bạn không thể bỏ lượt ở vòng mới.");

    return;

  }

  game.selected = [];

  nextTurn();

});


/* ==========================================
   NEXT TURN
   ========================================== */

function nextTurn() {

  game.currentPlayer =
    (game.currentPlayer + 1) % 4;

  renderGame();

  simulateBots();

}


/* ==========================================
   BOT
   ========================================== */

function simulateBots() {

  if (game.currentPlayer === 0) {

    setMessage("Đến lượt bạn.");

    return;

  }

  setTimeout(() => {

    const bot =
      game.players[game.currentPlayer];

    const move =
      findBotMove(bot.hand, game.table);

    if (move.length > 0) {

      const ids =
        move.map(card => card.id);

      bot.hand =
        bot.hand.filter(
          card => !ids.includes(card.id)
        );

      game.table = move;

      game.lastPlayer =
        game.currentPlayer;

      setMessage(
        `${bot.name} đã đánh ${formatMove(move)}`
      );

    } else {

      setMessage(`${bot.name} bỏ lượt.`);

    }

    if (bot.hand.length === 0) {

      endGame(bot.name);

      return;

    }

    game.currentPlayer =
      (game.currentPlayer + 1) % 4;

    renderGame();

    simulateBots();

  }, 900);

}


/* ==========================================
   BOT MOVE
   ========================================== */

function findBotMove(hand, table) {

  const sorted =
    [...hand].sort(compareCards);

  if (table.length === 0) {

    return [sorted[0]];

  }

  const tableLength =
    table.length;

  if (tableLength === 1) {

    const target = table[0];

    const card =
      sorted.find(
        c => c.rank > target.rank
      );

    return card ? [card] : [];

  }

  if (tableLength === 2) {

    const pairs = findGroups(sorted, 2);

    const pair =
      pairs.find(
        group => group[0].rank > table[0].rank
      );

    return pair || [];

  }

  if (tableLength === 3) {

    const triples = findGroups(sorted, 3);

    const triple =
      triples.find(
        group => group[0].rank > table[0].rank
      );

    return triple || [];

  }

  if (tableLength >= 5) {

    const straight =
      findStraight(sorted, tableLength);

    if (
      straight.length === tableLength &&
      straight[0].rank > table[0].rank
    ) {

      return straight;

    }

  }

  return [];

}


/* ==========================================
   VALIDATE MOVE
   ========================================== */

function isValidMove(cards, table) {

  if (cards.length === 0) {
    return false;
  }

  const type =
    getMoveType(cards);

  if (type === "invalid") {
    return false;
  }

  if (table.length === 0) {
    return true;
  }

  const tableType =
    getMoveType(table);

  if (type !== tableType) {

    return false;

  }

  if (cards.length !== table.length) {

    return false;

  }

  return cards[0].rank > table[0].rank;

}


/* ==========================================
   MOVE TYPE
   ========================================== */

function getMoveType(cards) {

  if (cards.length === 1) {
    return "single";
  }

  const sameRank =
    cards.every(
      card => card.rank === cards[0].rank
    );

  if (sameRank) {

    if (cards.length === 2) return "pair";

    if (cards.length === 3) return "triple";

    if (cards.length === 4) return "four";

  }

  if (
    cards.length >= 3 &&
    isStraight(cards)
  ) {

    return "straight";

  }

  return "invalid";

}


/* ==========================================
   STRAIGHT
   ========================================== */

function isStraight(cards) {

  const sorted =
    [...cards].sort(compareCards);

  for (let i = 1; i < sorted.length; i++) {

    if (
      sorted[i].rank !==
      sorted[i - 1].rank + 1
    ) {

      return false;

    }

  }

  return true;

}


/* ==========================================
   FIND GROUPS
   ========================================== */

function findGroups(cards, size) {

  const groups = {};

  cards.forEach(card => {

    if (!groups[card.rank]) {
      groups[card.rank] = [];
    }

    groups[card.rank].push(card);

  });

  return Object.values(groups)
    .filter(group => group.length >= size)
    .map(group => group.slice(0, size));

}


/* ==========================================
   FIND STRAIGHT
   ========================================== */

function findStraight(cards, length) {

  const sorted =
    [...cards].sort(compareCards);

  for (
    let i = 0;
    i <= sorted.length - length;
    i++
  ) {

    const sequence =
      sorted.slice(i, i + length);

    if (isStraight(sequence)) {

      return sequence;

    }

  }

  return [];

}


/* ==========================================
   RENDER TABLE
   ========================================== */

function renderPlayedCards() {

  const container =
    document.getElementById("playedCards");

  container.innerHTML = "";

  game.table.forEach(card => {

    container.appendChild(
      createCardElement(card)
    );

  });

}


/* ==========================================
   MESSAGE
   ========================================== */

function setMessage(message) {

  document.getElementById("message").textContent =
    message;

}


/* ==========================================
   FORMAT MOVE
   ========================================== */

function formatMove(cards) {

  return cards
    .map(card => `${card.label}${card.suit}`)
    .join(" ");

}


/* ==========================================
   END GAME
   ========================================== */

function endGame(winner = playerName) {

  setTimeout(() => {

    alert(`🏆 ${winner} đã thắng!`);

    showScreen("homeScreen");

  }, 500);

}


/* ==========================================
   LEAVE GAME
   ========================================== */

document.getElementById("leaveGameBtn").addEventListener("click", () => {

  game = null;

  currentRoom = null;

  showScreen("homeScreen");

});


/* ==========================================
   AUTO LOGIN
   ========================================== */

const savedName =
  localStorage.getItem("liTamPlayerName");

if (savedName) {

  playerName = savedName;

  document.getElementById("playerName").value =
    savedName;

  document.getElementById("homePlayerName").textContent =
    savedName;

  showScreen("homeScreen");

}
