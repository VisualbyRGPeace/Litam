// ===============================
// FIX: LOBBY BUTTONS
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // Nút TẠO PHÒNG
    const createBtn = document.getElementById("createRoomBtn");

    if (createBtn) {
        createBtn.addEventListener("click", function (e) {
            e.preventDefault();

            console.log("CREATE ROOM CLICKED");

            const roomId =
                "LT-" + Math.floor(100 + Math.random() * 900);

            const room = {
                id: roomId,
                host: localStorage.getItem("litam_username") || "Bạn",
                players: 1,
                maxPlayers: 4
            };

            // Lưu phòng
            let rooms = JSON.parse(
                localStorage.getItem("litam_rooms") || "[]"
            );

            rooms.push(room);

            localStorage.setItem(
                "litam_rooms",
                JSON.stringify(rooms)
            );

            // Vào game ngay
            if (typeof startGame === "function") {
                startGame();
            }

            if (typeof showScreen === "function") {
                showScreen("gameScreen");
            }

            console.log("ROOM CREATED:", roomId);
        });
    }


    // ===============================
    // NÚT THAM GIA PHÒNG
    // ===============================

    document.addEventListener("click", function (e) {

        const joinBtn = e.target.closest(".join-room-btn");

        if (!joinBtn) return;

        e.preventDefault();

        const roomId = joinBtn.dataset.room;

        console.log("JOIN ROOM:", roomId);

        // Lưu phòng đang tham gia
        localStorage.setItem(
            "litam_current_room",
            roomId
        );

        // Vào game
        if (typeof startGame === "function") {
            startGame();
        }

        if (typeof showScreen === "function") {
            showScreen("gameScreen");
        }
    });

});
