document.addEventListener("DOMContentLoaded", function () {

    const loginBtn = document.getElementById("loginBtn");
    const playerName = document.getElementById("playerName");

    const loginScreen = document.getElementById("loginScreen");
    const homeScreen = document.getElementById("homeScreen");
    const homePlayerName = document.getElementById("homePlayerName");

    loginBtn.addEventListener("click", function () {

        const name = playerName.value.trim();

        if (name === "") {
            alert("Vui lòng nhập tên người chơi");
            return;
        }

        homePlayerName.textContent = name;

        loginScreen.classList.remove("active");
        homeScreen.classList.add("active");

    });

});
