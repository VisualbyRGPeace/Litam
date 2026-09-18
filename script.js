/* =========================================================
   LÌ TÁM
   TIẾN LÊN MIỀN NAM
   MVP LOCAL + BOT

   Không cần Firebase ở phiên bản này.
========================================================= */


/* =========================================================
   1. DATA
========================================================= */

const SUITS = [
  {
    id: "spades",
    symbol: "♠",
    color: "black",
    power: 1
  },

  {
    id: "clubs",
    symbol: "♣",
    color: "black",
    power: 2
  },

  {
    id: "diamonds",
    symbol: "♦",
    color: "red",
    power: 3
  },

  {
    id: "hearts",
    symbol: "♥",
    color: "red",
    power: 4
  }
];


const RANKS = [
  {
    value: 3,
    label: "3"
  },

  {
    value: 4,
    label: "4"
  },

  {
    value: 5,
    label: "5"
  },

  {
    value: 6,
    label: "6"
  },

  {
    value: 7,
    label: "7"
  },

  {
    value: 8,
    label: "8"
  },

  {
    value: 9,
    label: "9"
  },

  {
    value: 10,
    label: "10"
  },

  {
    value: 11,
    label: "J"
  },

  {
    value: 12,
    label: "Q"
  },

  {
    value: 13,
    label: "K"
  },

  {
    value: 14,
    label: "A"
  },

  {
    value: 15,
    label: "2"
  }
];


/* =========================================================
   2. GLOBAL STATE
========================================================= */

let playerName = "";

let currentRoom = null;

let game = null;

let rooms = [];


/* =========================================================
   3. ELEMENTS
========================================================= */

const $ = id =>
  document.getElementById(id);


/* =========================================================
   4. SCREEN
========================================================= */

function showScreen(screenId) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.remove("active");

    });


  $(screenId)
    .classList.add("active");

}


/* =========================================================
   5. LOCAL PLAYER
========================================================= */

function loadPlayer() {

  const saved =
    localStorage.getItem(
      "liTamPlayerName"
    );


  if (!saved) {

    showScreen("loginScreen");

    return;

  }


  playerName = saved;

  updatePlayerUI();

  showScreen("homeScreen");

}


function updatePlayerUI() {

  const safeName =
    playerName || "Player";


  $("homePlayerName")
    .textContent = safeName;


  $("gamePlayerName")
    .textContent = safeName;


  const initial =
    safeName
      .charAt(0)
      .toUpperCase();


  $("profileInitial")
    .textContent = initial;


  $("myInitial")
    .textContent = initial;

}


/* =========================================================
   6. LOGIN
========================================================= */

$("loginBtn")
  .addEventListener(
    "click",
    login
  );


$("playerName")
  .addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {

        login();

      }

    }
  );


function login() {

  const name =
    $("playerName")
      .value
      .trim();


  if (!name) {

    $("playerName").focus();

    return;

  }


  playerName = name;


  localStorage.setItem(
    "liTamPlayerName",
    playerName
  );


  updatePlayerUI();

  showScreen("homeScreen");

}


/* =========================================================
   7. LOGOUT
========================================================= */

$("logoutBtn")
  .addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "liTamPlayerName"
      );

      playerName = "";

      $("playerName")
        .value = "";

      showScreen(
        "loginScreen"
      );

    }
  );


/* =========================================================
   8. HOME
========================================================= */

$("tienLenBtn")
  .addEventListener(
    "click",
    () => {

      createDefaultRooms();

      renderRooms();

      showScreen(
        "lobbyScreen"
      );

    }
  );


$("backHomeBtn")
  .addEventListener(
    "click",
    () => {

      showScreen(
        "homeScreen"
      );

    }
  );


/* =========================================================
   9. ROOMS
========================================================= */

function createDefaultRooms() {

  if (rooms.length > 0) {
    return;
  }


  rooms = [

    {
      id: "LT-101",
      players: 1,
      maxPlayers: 4,
      status: "Đang chờ"
    },

    {
      id: "LT-208",
      players: 2,
      maxPlayers: 4,
      status: "Đang chờ"
    },

    {
      id: "LT-315",
      players: 3,
      maxPlayers: 4,
      status: "Sắp đầy"
    }

  ];

}


function renderRooms() {

  const container =
    $("roomList");


  container.innerHTML = "";


  if (rooms.length === 0) {

    container.innerHTML = `
      <div class="room">
        <div class="room-left">
          <strong>Chưa có phòng</strong>
          <span>Hãy tạo phòng mới.</span>
        </div>
      </div>
    `;

    return;

  }


  rooms.forEach(room => {

    const element =
      document.createElement(
        "div"
      );


    element.className =
      "room";


    element.innerHTML = `

      <div class="room-left">

        <strong>
          Phòng ${room.id}
        </strong>

        <span>
          ${room.players}/${room.maxPlayers}
          người chơi
        </span>

      </div>

      <div class="room-right">

        <span class="room-status">
          ${room.status}
        </span>

        <button
          class="btn btn-secondary"
        >
          THAM GIA
        </button>

      </div>

    `;


    const joinButton =
      element.querySelector(
        "button"
      );


    joinButton.addEventListener(
      "click",
      () => {

        joinRoom(room);

      }
    );


    container.appendChild(
      element
    );

  });

}


/* =========================================================
   10. CREATE ROOM
========================================================= */

$("createRoomBtn")
  .addEventListener(
    "click",
    () => {

      const random =
        Math.floor(
          100 +
          Math.random() * 900
        );


      const room = {

        id: `LT-${random}`,

        players: 1,

        maxPlayers: 4,

        status: "Đang chờ"

      };


      rooms.unshift(room);


      joinRoom(room);

    }
  );


/* =========================================================
   11. JOIN ROOM
========================================================= */

function joinRoom(room) {

  currentRoom = room;


  $("roomIdText")
    .textContent = room.id;


  startGame();


  showScreen(
    "gameScreen"
  );

}


/* =========================================================
   12. CREATE DECK
========================================================= */

function createDeck() {

  const deck = [];


  RANKS.forEach(rank => {

    SUITS.forEach(suit => {

      deck.push({

        id:
          `${rank.value}_${suit.id}`,

        rank:
          rank.value,

        label:
          rank.label,

        suit:
          suit.symbol,

        suitId:
          suit.id,

        suitPower:
          suit.power,

        color:
          suit.color

      });

    });

  });


  return deck;

}


/* =========================================================
   13. SHUFFLE
========================================================= */

function shuffle(array) {

  const deck =
    [...array];


  for (
    let i = deck.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    [
      deck[i],
      deck[j]
    ] =
    [
      deck[j],
      deck[i]
    ];

  }


  return deck;

}


/* =========================================================
   14. CARD COMPARISON
========================================================= */

function compareCards(a, b) {

  if (a.rank !== b.rank) {

    return a.rank - b.rank;

  }


  return (
    a.suitPower -
    b.suitPower
  );

}


/* =========================================================
   15. START GAME
========================================================= */

function startGame() {

  let deck =
    shuffle(
      createDeck()
    );


  /*
    Tạo 4 người.
  */

  const players = [

    {
      id: 0,
      name: playerName,
      isHuman: true,
      hand: []
    },

    {
      id: 1,
      name: "Minh",
      isHuman: false,
      hand: []
    },

    {
      id: 2,
      name: "An",
      isHuman: false,
      hand: []
    },

    {
      id: 3,
      name: "Khang",
      isHuman: false,
      hand: []
    }

  ];


  /*
    Chia bài.
  */

  for (
    let i = 0;
    i < 52;
    i++
  ) {

    players[
      i % 4
    ]
    .hand
    .push(
      deck[i]
    );

  }


  /*
    Sort bài.
  */

  players.forEach(
    player => {

      player.hand.sort(
        compareCards
      );

    }
  );


  /*
    Tìm người giữ 3♠.
  */

  const firstPlayer =
    findThreeOfSpades(
      players
    );


  game = {

    players,

    currentPlayer:
      firstPlayer,

    tableCards: [],

    tableType: null,

    lastPlayer:
      null,

    passCount: 0,

    selected: [],

    roundStarted: false,

    finished: false

  };


  updateOpponentNames();

  renderGame();


  const firstName =
    players[firstPlayer]
      .name;


  setMessage(
    `${firstName} có 3♠ và đi trước.`
  );


  if (
    firstPlayer !== 0
  ) {

    setTimeout(
      botTurn,
      1000
    );

  }

}


/* =========================================================
   16. FIND 3 SPADES
========================================================= */

function findThreeOfSpades(players) {

  for (
    const player of players
  ) {

    const found =
      player.hand.find(
        card =>
          card.rank === 3 &&
          card.suitId === "spades"
      );


    if (found) {

      return player.id;

    }

  }


  return 0;

}


/* =========================================================
   17. UPDATE PLAYER NAMES
========================================================= */

function updateOpponentNames() {

  if (!game) {
    return;
  }


  $("player2")
    .querySelector("strong")
    .textContent =
    game.players[1].name;


  $("player3")
    .querySelector("strong")
    .textContent =
    game.players[2].name;


  $("player4")
    .querySelector("strong")
    .textContent =
    game.players[3].name;

}


/* =========================================================
   18. RENDER GAME
========================================================= */

function renderGame() {

  if (!game) {
    return;
  }


  renderMyHand();

  renderPlayedCards();

  updateCounts();

  updateTurn();

}


/* =========================================================
   19. RENDER HAND
========================================================= */

function renderMyHand() {

  const container =
    $("myHand");


  container.innerHTML = "";


  const hand =
    game.players[0].hand;


  hand.forEach(card => {

    const element =
      createCardElement(
        card
      );


    const selected =
      game.selected.some(
        selectedCard =>
          selectedCard.id ===
          card.id
      );


    if (selected) {

      element.classList.add(
        "selected"
      );

    }


    element.addEventListener(
      "click",
      () => {

        if (
          game.currentPlayer !== 0
        ) {

          return;

        }


        toggleCard(card);

      }
    );


    container.appendChild(
      element
    );

  });

}


/* =========================================================
   20. CREATE CARD ELEMENT
========================================================= */

function createCardElement(card) {

  const element =
    document.createElement(
      "div"
    );


  element.className =
    "card";


  if (
    card.color === "red"
  ) {

    element.classList.add(
      "red"
    );

  }


  element.innerHTML = `

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


  return element;

}


/* =========================================================
   21. SELECT CARD
========================================================= */

function toggleCard(card) {

  const index =
    game.selected.findIndex(
      selected =>
        selected.id ===
        card.id
    );


  if (index >= 0) {

    game.selected.splice(
      index,
      1
    );

  } else {

    game.selected.push(
      card
    );

  }


  game.selected.sort(
    compareCards
  );


  renderMyHand();

}


/* =========================================================
   22. GET MOVE TYPE
========================================================= */

function getMoveType(cards) {

  if (!cards.length) {

    return "invalid";

  }


  const sorted =
    [...cards]
      .sort(compareCards);


  /*
    1 lá
  */

  if (
    sorted.length === 1
  ) {

    return "single";

  }


  /*
    2 lá giống nhau
  */

  if (
    sorted.length === 2 &&
    sameRank(sorted)
  ) {

    return "pair";

  }


  /*
    3 lá giống nhau
  */

  if (
    sorted.length === 3 &&
    sameRank(sorted)
  ) {

    return "triple";

  }


  /*
    4 lá giống nhau
  */

  if (
    sorted.length === 4 &&
    sameRank(sorted)
  ) {

    return "four";

  }


  /*
    Sảnh
  */

  if (
    sorted.length >= 3 &&
    isStraight(sorted)
  ) {

    return "straight";

  }


  /*
    3 đôi thông
  */

  if (
    isConsecutivePairs(
      sorted,
      3
    )
  ) {

    return "threePairs";

  }


  /*
    4 đôi thông
  */

  if (
    isConsecutivePairs(
      sorted,
      4
    )
  ) {

    return "fourPairs";

  }


  return "invalid";

}


/* =========================================================
   23. SAME RANK
========================================================= */

function sameRank(cards) {

  return cards.every(
    card =>
      card.rank ===
      cards[0].rank
  );

}


/* =========================================================
   24. STRAIGHT
========================================================= */

function isStraight(cards) {

  const sorted =
    [...cards]
      .sort(compareCards);


  /*
    Trong Tiến Lên,
    2 không nằm trong sảnh.
  */

  if (
    sorted.some(
      card =>
        card.rank === 15
    )
  ) {

    return false;

  }


  for (
    let i = 1;
    i < sorted.length;
    i++
  ) {

    if (
      sorted[i].rank !==
      sorted[i - 1].rank + 1
    ) {

      return false;

    }

  }


  return true;

}


/* =========================================================
   25. CONSECUTIVE PAIRS
========================================================= */

function isConsecutivePairs(
  cards,
  pairCount
) {

  if (
    cards.length !==
    pairCount * 2
  ) {

    return false;

  }


  const sorted =
    [...cards]
      .sort(compareCards);


  for (
    let i = 0;
    i < sorted.length;
    i += 2
  ) {

    if (
      sorted[i].rank !==
      sorted[i + 1].rank
    ) {

      return false;

    }

  }


  for (
    let i = 2;
    i < sorted.length;
    i += 2
  ) {

    if (
      sorted[i].rank !==
      sorted[i - 2].rank + 1
    ) {

      return false;

    }

  }


  /*
    2 không được dùng
    trong đôi thông.
  */

  if (
    sorted.some(
      card =>
        card.rank === 15
    )
  ) {

    return false;

  }


  return true;

}


/* =========================================================
   26. SPECIAL MOVE POWER
========================================================= */

function canSpecialBeat(
  selected,
  table
) {

  const selectedType =
    getMoveType(
      selected
    );


  const tableType =
    getMoveType(
      table
    );


  /*
    Tứ quý chặt 2.
  */

  if (
    selectedType === "four" &&
    tableType === "single" &&
    table[0].rank === 15
  ) {

    return true;

  }


  /*
    3 đôi thông chặt 2.
  */

  if (
    selectedType === "threePairs" &&
    tableType === "single" &&
    table[0].rank === 15
  ) {

    return true;

  }


  /*
    4 đôi thông chặt 2.
  */

  if (
    selectedType === "fourPairs" &&
    tableType === "single" &&
    table[0].rank === 15
  ) {

    return true;

  }


  /*
    4 đôi thông chặt tứ quý.
  */

  if (
    selectedType === "fourPairs" &&
    tableType === "four"
  ) {

    return true;

  }


  /*
    4 đôi thông chặt 3 đôi thông.
  */

  if (
    selectedType === "fourPairs" &&
    tableType === "threePairs"
  ) {

    return true;

  }


  return false;

}


/* =========================================================
   27. MOVE VALIDATION
========================================================= */

function isValidMove(
  selected,
  table
) {

  if (!selected.length) {

    return false;

  }


  const selectedType =
    getMoveType(
      selected
    );


  if (
    selectedType === "invalid"
  ) {

    return false;

  }


  /*
    Bàn trống:
    mọi nước hợp lệ đều được đánh.
  */

  if (!table.length) {

    return true;

  }


  /*
    Luật chặt đặc biệt.
  */

  if (
    canSpecialBeat(
      selected,
      table
    )
  ) {

    return true;

  }


  const tableType =
    getMoveType(
      table
    );


  /*
    Phải cùng loại.
  */

  if (
    selectedType !==
    tableType
  ) {

    return false;

  }


  /*
    Cùng số lượng.
  */

  if (
    selected.length !==
    table.length
  ) {

    return false;

  }


  const selectedSorted =
    [...selected]
      .sort(compareCards);


  const tableSorted =
    [...table]
      .sort(compareCards);


  /*
    So rank cao nhất.
  */

  return (
    selectedSorted[
      selectedSorted.length - 1
    ].rank >
    tableSorted[
      tableSorted.length - 1
    ].rank
  );

}


/* =========================================================
   28. PLAY HUMAN
========================================================= */

$("playBtn")
  .addEventListener(
    "click",
    playHuman
  );


function playHuman() {

  if (!game) {
    return;
  }


  if (
    game.currentPlayer !== 0
  ) {

    setMessage(
      "Chưa đến lượt của bạn."
    );

    return;

  }


  const selected =
    [...game.selected]
      .sort(compareCards);


  if (!selected.length) {

    setMessage(
      "Hãy chọn bài muốn đánh."
    );

    return;

  }


  if (
    !isValidMove(
      selected,
      game.tableCards
    )
  ) {

    setMessage(
      getInvalidMoveMessage(
        selected,
        game.tableCards
      )
    );

    return;

  }


  /*
    Nếu vòng mới,
    người đi đầu phải có 3♠.
  */

  if (
    !game.roundStarted
  ) {

    const hasThreeSpades =
      selected.some(
        card =>
          card.rank === 3 &&
          card.suitId ===
            "spades"
      );


    /*
      Chỉ bắt buộc 3♠
      ở nước đi đầu tiên.
    */

    if (
      game.currentPlayer ===
      findThreeOfSpades(game.players)
      &&
      !hasThreeSpades
    ) {

      setMessage(
        "Lượt đầu tiên phải chứa 3♠."
      );

      return;

    }

  }


  removeCardsFromPlayer(
    0,
    selected
  );


  game.tableCards =
    selected;


  game.tableType =
    getMoveType(
      selected
    );


  game.lastPlayer = 0;

  game.passCount = 0;

  game.roundStarted = true;

  game.selected = [];


  setMessage(
    `${playerName} đánh ${formatCards(selected)}`
  );


  renderGame();


  checkWinner();


  if (game.finished) {
    return;
  }


  nextPlayer();

}


/* =========================================================
   29. PASS
========================================================= */

$("passBtn")
  .addEventListener(
    "click",
    passHuman
  );


function passHuman() {

  if (!game) {
    return;
  }


  if (
    game.currentPlayer !== 0
  ) {

    setMessage(
      "Chưa đến lượt của bạn."
    );

    return;

  }


  /*
    Không được bỏ nếu
    chưa có người đánh.
  */

  if (
    !game.tableCards.length
  ) {

    setMessage(
      "Không thể bỏ lượt ở vòng mới."
    );

    return;

  }


  game.selected = [];

  game.passCount++;


  setMessage(
    `${playerName} bỏ lượt.`
  );


  /*
    Nếu 3 người liên tiếp bỏ,
    vòng kết thúc.

    Người đánh cuối cùng
    được đánh bất kỳ.
  */

  if (
    game.passCount >= 3
  ) {

    game.tableCards = [];

    game.tableType = null;

    game.passCount = 0;

    game.currentPlayer =
      game.lastPlayer;


    setMessage(
      `${game.players[game.lastPlayer].name} được mở vòng mới.`
    );


    renderGame();


    if (
      game.currentPlayer !== 0
    ) {

      setTimeout(
        botTurn,
        800
      );

    }

    return;

  }


  nextPlayer();

}


/* =========================================================
   30. NEXT PLAYER
========================================================= */

function nextPlayer() {

  game.currentPlayer =
    (
      game.currentPlayer + 1
    ) % 4;


  renderGame();


  if (
    game.currentPlayer === 0
  ) {

    setMessage(
      "Đến lượt của bạn."
    );

    return;

  }


  setTimeout(
    botTurn,
    750
  );

}


/* =========================================================
   31. BOT TURN
========================================================= */

function botTurn() {

  if (!game) {
    return;
  }


  if (game.finished) {
    return;
  }


  if (
    game.currentPlayer === 0
  ) {

    return;

  }


  const bot =
    game.players[
      game.currentPlayer
    ];


  /*
    Tìm nước đi.
  */

  const move =
    findBotMove(
      bot.hand,
      game.tableCards,
      game.roundStarted
    );


  /*
    Nếu không đánh được
    thì bỏ.
  */

  if (!move.length) {

    /*
      Nếu bàn đang trống,
      bot bắt buộc phải đánh.
    */

    if (
      !game.tableCards.length
    ) {

      const fallback =
        findLowestValidMove(
          bot.hand
        );


      if (
        fallback.length
      ) {

        executeBotMove(
          bot,
          fallback
        );

        return;

      }

    }


    game.passCount++;


    setMessage(
      `${bot.name} bỏ lượt.`
    );


    if (
      game.passCount >= 3
    ) {

      game.tableCards = [];

      game.tableType = null;

      game.passCount = 0;

      game.currentPlayer =
        game.lastPlayer;


      setMessage(
        `${game.players[game.lastPlayer].name} được mở vòng mới.`
      );


      renderGame();


      if (
        game.currentPlayer !== 0
      ) {

        setTimeout(
          botTurn,
          750
        );

      }

      return;

    }


    game.currentPlayer =
      (
        game.currentPlayer + 1
      ) % 4;


    renderGame();


    if (
      game.currentPlayer === 0
    ) {

      setMessage(
        "Đến lượt của bạn."
      );

      return;

    }


    setTimeout(
      botTurn,
      750
    );


    return;

  }


  executeBotMove(
    bot,
    move
  );

}


/* =========================================================
   32. EXECUTE BOT MOVE
========================================================= */

function executeBotMove(
  bot,
  move
) {

  /*
    Bot đầu tiên phải có 3♠.
  */

  if (
    !game.roundStarted
  ) {

    const hasThreeSpades =
      move.some(
        card =>
          card.rank === 3 &&
          card.suitId === "spades"
      );


    if (
      !hasThreeSpades
    ) {

      const forced =
        bot.hand.find(
          card =>
            card.rank === 3 &&
            card.suitId ===
              "spades"
        );


      if (forced) {

        move = [
          forced
        ];

      }

    }

  }


  removeCardsFromPlayer(
    bot.id,
    move
  );


  game.tableCards =
    [...move];


  game.tableType =
    getMoveType(
      move
    );


  game.lastPlayer =
    bot.id;


  game.passCount = 0;

  game.roundStarted = true;


  setMessage(
    `${bot.name} đánh ${formatCards(move)}`
  );


  renderGame();


  checkWinner();


  if (game.finished) {
    return;
  }


  game.currentPlayer =
    (
      bot.id + 1
    ) % 4;


  renderGame();


  if (
    game.currentPlayer === 0
  ) {

    setMessage(
      "Đến lượt của bạn."
    );

    return;

  }


  setTimeout(
    botTurn,
    750
  );

}


/* =========================================================
   33. FIND BOT MOVE
========================================================= */

function findBotMove(
  hand,
  table,
  roundStarted
) {

  const sorted =
    [...hand]
      .sort(compareCards);


  /*
    Nếu bàn trống:
    đánh thấp nhất.

    Nếu đây là nước đầu,
    phải chứa 3♠.
  */

  if (!table.length) {

    if (!roundStarted) {

      const threeSpades =
        sorted.find(
          card =>
            card.rank === 3 &&
            card.suitId ===
              "spades"
        );


      if (threeSpades) {

        return [
          threeSpades
        ];

      }

    }


    return [
      sorted[0]
    ];

  }


  const tableType =
    getMoveType(table);


  /*
    Đánh lẻ.
  */

  if (
    tableType === "single"
  ) {

    /*
      Tìm lá nhỏ nhất
      có thể thắng.
    */

    const normal =
      sorted.find(
        card =>
          isValidMove(
            [card],
            table
          )
      );


    if (normal) {

      return [
        normal
      ];

    }


    /*
      Nếu có tứ quý / đôi thông
      có thể chặt 2.
    */

    const four =
      findGroup(
        sorted,
        4
      );


    if (
      table[0].rank === 15 &&
      four.length
    ) {

      return four;

    }


    const threePairs =
      findConsecutivePairs(
        sorted,
        3
      );


    if (
      table[0].rank === 15 &&
      threePairs.length
    ) {

      return threePairs;

    }


    const fourPairs =
      findConsecutivePairs(
        sorted,
        4
      );


    if (
      table[0].rank === 15 &&
      fourPairs.length
    ) {

      return fourPairs;

    }


    return [];

  }


  /*
    Đôi.
  */

  if (
    tableType === "pair"
  ) {

    const pairs =
      findAllGroups(
        sorted,
        2
      );


    for (
      const pair of pairs
    ) {

      if (
        isValidMove(
          pair,
          table
        )
      ) {

        return pair;

      }

    }


    return [];

  }


  /*
    Bộ ba.
  */

  if (
    tableType === "triple"
  ) {

    const triples =
      findAllGroups(
        sorted,
        3
      );


    for (
      const triple of triples
    ) {

      if (
        isValidMove(
          triple,
          table
        )
      ) {

        return triple;

      }

    }


    return [];

  }


  /*
    Sảnh.
  */

  if (
    tableType === "straight"
  ) {

    const straight =
      findStraightOfLength(
        sorted,
        table.length
      );


    if (
      straight.length &&
      isValidMove(
        straight,
        table
      )
    ) {

      return straight;

    }


    return [];

  }


  /*
    Tứ quý.
  */

  if (
    tableType === "four"
  ) {

    const fourPairs =
      findConsecutivePairs(
        sorted,
        4
      );


    if (
      fourPairs.length &&
      isValidMove(
        fourPairs,
        table
      )
    ) {

      return fourPairs;

    }


    return [];

  }


  /*
    3 đôi thông.
  */

  if (
    tableType === "threePairs"
  ) {

    const fourPairs =
      findConsecutivePairs(
        sorted,
        4
      );


    if (
      fourPairs.length &&
      isValidMove(
        fourPairs,
        table
      )
    ) {

      return fourPairs;

    }


    return [];

  }


  return [];

}


/* =========================================================
   34. FIND LOWEST VALID MOVE
========================================================= */

function findLowestValidMove(hand) {

  const sorted =
    [...hand]
      .sort(compareCards);


  if (!sorted.length) {
    return [];
  }


  /*
    Nếu có 3♠ thì ưu tiên.
  */

  const threeSpades =
    sorted.find(
      card =>
        card.rank === 3 &&
        card.suitId === "spades"
    );


  if (threeSpades) {

    return [
      threeSpades
    ];

  }


  return [
    sorted[0]
  ];

}


/* =========================================================
   35. FIND GROUP
========================================================= */

function findGroup(
  cards,
  size
) {

  const groups =
    findAllGroups(
      cards,
      size
    );


  return groups.length
    ? groups[0]
    : [];

}


/* =========================================================
   36. FIND ALL GROUPS
========================================================= */

function findAllGroups(
  cards,
  size
) {

  const groups = {};


  cards.forEach(card => {

    if (
      !groups[card.rank]
    ) {

      groups[card.rank] = [];

    }


    groups[card.rank].push(
      card
    );

  });


  return Object.values(groups)
    .filter(
      group =>
        group.length >= size
    )
    .map(
      group =>
        group.slice(0, size)
    )
    .sort(
      (a, b) =>
        a[0].rank -
        b[0].rank
    );

}


/* =========================================================
   37. FIND CONSECUTIVE PAIRS
========================================================= */

function findConsecutivePairs(
  cards,
  pairCount
) {

  const pairs =
    findAllGroups(
      cards,
      2
    );


  if (
    pairs.length <
    pairCount
  ) {

    return [];

  }


  for (
    let i = 0;
    i <= pairs.length - pairCount;
    i++
  ) {

    const sequence =
      pairs.slice(
        i,
        i + pairCount
      );


    let valid = true;


    for (
      let j = 1;
      j < sequence.length;
      j++
    ) {

      if (
        sequence[j][0].rank !==
        sequence[j - 1][0].rank + 1
      ) {

        valid = false;

        break;

      }

    }


    if (valid) {

      return sequence.flat();

    }

  }


  return [];

}


/* =========================================================
   38. FIND STRAIGHT
========================================================= */

function findStraightOfLength(
  cards,
  length
) {

  const sorted =
    [...cards]
      .sort(compareCards);


  for (
    let i = 0;
    i <= sorted.length - length;
    i++
  ) {

    const sequence =
      sorted.slice(
        i,
        i + length
      );


    if (
      isStraight(sequence)
    ) {

      return sequence;

    }

  }


  return [];

}


/* =========================================================
   39. REMOVE CARDS
========================================================= */

function removeCardsFromPlayer(
  playerId,
  cards
) {

  const ids =
    cards.map(
      card => card.id
    );


  game.players[playerId].hand =
    game.players[playerId]
      .hand
      .filter(
        card =>
          !ids.includes(
            card.id
          )
      );

}


/* =========================================================
   40. UPDATE COUNTS
========================================================= */

function updateCounts() {

  if (!game) {
    return;
  }


  $("myCardCount")
    .textContent =
    `${game.players[0].hand.length} lá`;


  $("player2")
    .querySelector("small")
    .textContent =
    `${game.players[1].hand.length} lá`;


  $("player3")
    .querySelector("small")
    .textContent =
    `${game.players[2].hand.length} lá`;


  $("player4")
    .querySelector("small")
    .textContent =
    `${game.players[3].hand.length} lá`;

}


/* =========================================================
   41. UPDATE TURN
========================================================= */

function updateTurn() {

  if (!game) {
    return;
  }


  const current =
    game.players[
      game.currentPlayer
    ];


  $("turnText")
    .textContent =
    `Lượt của ${current.name}`;


  if (
    game.currentPlayer === 0
  ) {

    $("myTurnBadge")
      .classList.remove(
        "hidden"
      );

  } else {

    $("myTurnBadge")
      .classList.add(
        "hidden"
      );

  }

}


/* =========================================================
   42. RENDER PLAYED CARDS
========================================================= */

function renderPlayedCards() {

  const container =
    $("playedCards");


  container.innerHTML = "";


  if (
    !game.tableCards.length
  ) {

    return;

  }


  game.tableCards.forEach(
    card => {

      const element =
        createCardElement(
          card
        );


      container.appendChild(
        element
      );

    }
  );


  $("playedBy")
    .textContent =
    `Bài của ${
      game.players[
        game.lastPlayer
      ].name
    }`;

}


/* =========================================================
   43. FORMAT CARDS
========================================================= */

function formatCards(cards) {

  return cards
    .map(
      card =>
        `${card.label}${card.suit}`
    )
    .join(" ");

}


/* =========================================================
   44. INVALID MESSAGE
========================================================= */

function getInvalidMoveMessage(
  selected,
  table
) {

  const type =
    getMoveType(
      selected
    );


  if (
    type === "invalid"
  ) {

    return "Bộ bài bạn chọn không hợp lệ.";

  }


  if (
    table.length &&
    !canSpecialBeat(
      selected,
      table
    ) &&
    type !==
      getMoveType(table)
  ) {

    return "Bạn phải đánh cùng loại với bộ bài trên bàn.";

  }


  if (
    table.length &&
    !canSpecialBeat(
      selected,
      table
    )
  ) {

    return "Bộ bài này chưa đủ lớn để chặt.";

  }


  return "Nước đi không hợp lệ.";

}


/* =========================================================
   45. CHECK WINNER
========================================================= */

function checkWinner() {

  if (!game) {
    return;
  }


  const winner =
    game.players.find(
      player =>
        player.hand.length === 0
    );


  if (!winner) {
    return;
  }


  game.finished = true;


  setTimeout(
    () => {

      showResult(
        winner
      );

    },
    400
  );

}


/* =========================================================
   46. RESULT
========================================================= */

function showResult(
  winner
) {

  const modal =
    $("resultModal");


  const title =
    $("resultTitle");


  const text =
    $("resultText");


  if (
    winner.id === 0
  ) {

    title.textContent =
      "Bạn thắng!";


    text.textContent =
      "Bạn đã đánh hết toàn bộ bài.";

  } else {

    title.textContent =
      `${winner.name} thắng`;


    text.textContent =
      `${winner.name} đã đánh hết bài trước.`;

  }


  modal.classList.add(
    "show"
  );

}


/* =========================================================
   47. NEW GAME
========================================================= */

$("newGameBtn")
  .addEventListener(
    "click",
    () => {

      $("resultModal")
        .classList.remove(
          "show"
        );


      startGame();

    }
  );


/* =========================================================
   48. RESULT HOME
========================================================= */

$("resultHomeBtn")
  .addEventListener(
    "click",
    () => {

      $("resultModal")
        .classList.remove(
          "show"
        );


      game = null;

      showScreen(
        "homeScreen"
      );

    }
  );


/* =========================================================
   49. LEAVE GAME
========================================================= */

$("leaveGameBtn")
  .addEventListener(
    "click",
    () => {

      game = null;

      currentRoom = null;

      $("resultModal")
        .classList.remove(
          "show"
        );


      showScreen(
        "lobbyScreen"
      );


      renderRooms();

    }
  );


/* =========================================================
   50. MESSAGE
========================================================= */

function setMessage(message) {

  $("message")
    .textContent =
    message;

}


/* =========================================================
   51. INITIALIZE
========================================================= */

loadPlayer();
