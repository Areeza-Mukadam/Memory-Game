console.log("game.js has loaded");
document.addEventListener('DOMContentLoaded', () => {

    if (document.body.classList.contains("game-page")) {
        const cards = document.querySelectorAll('.cards > span');

        let flippedCard1 = null;
        let flippedCard2 = null;
        let lockBoard = false;
        let matchedPairs = 0;
        const totalPairs = cards.length / 2;

        shuffleCards();
        cards.forEach(card => card.addEventListener('click', handleCardClicks));

        function handleCardClicks(e) {
            const card = e.currentTarget;
            if (lockBoard) return;
            if (card.classList.contains('flipped')) return;
            if (card.classList.contains('matched')) return;
            card.classList.add('flipped');

            if (!flippedCard1) {
                flippedCard1 = card;
                return;
            }

            flippedCard2 = card;
            lockBoard = true;
            checkForMatch();
        }

        function checkForMatch() {
            const isMatch = flippedCard1.dataset.id === flippedCard2.dataset.id;

            if (isMatch) {
                flippedCard1.classList.add('matched', 'SuccessfulPairs');
                flippedCard2.classList.add('matched', 'SuccessfulPairs');
                flippedCard1.removeEventListener('click', handleCardClicks);
                flippedCard2.removeEventListener('click', handleCardClicks);

                matchedPairs++;
                resetTurn();

                if (matchedPairs === totalPairs) {
                    clearInterval(timer);
                    endGame(true);
                }
            } else {
                setTimeout(() => {
                    flippedCard1.classList.remove('flipped');
                    flippedCard2.classList.remove('flipped');
                    resetTurn();
                }, 1000);
            }
        }

        function resetTurn() {
            [flippedCard1, flippedCard2] = [null, null];
            lockBoard = false;
        }

        function shuffleCards() {
            const parent = document.querySelector(".cards");
            const cardsArr = Array.from(parent.children);
            cardsArr.sort(() => Math.random() - 0.5);
            cardsArr.forEach(c => parent.appendChild(c));
        }

        let timeLeft = 60;
        const totalTime = 60;
        const countdown = document.getElementById("count_down");

        countdown.textContent = "Time Left: " + timeLeft + "s";

        const timer = setInterval(updateTimer, 1000);

        function updateTimer() {
            timeLeft--;
            countdown.textContent = "Time Left: " + timeLeft + "s";

            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame(false);
            }
        }

        function endGame(didWin) {
            const timeTaken = totalTime - timeLeft;
            let stars = 0;

            if (didWin) {
                if (timeTaken <= totalTime / 3) {
                    stars = 3;
                } else if (timeTaken <= (totalTime * 2) / 3) {
                    stars = 2;
                } else {
                    stars = 1;
                }
            }

            localStorage.setItem("didWin", didWin);
            localStorage.setItem("timeTaken", timeTaken);
            localStorage.setItem("stars", stars);

            window.location.href = "gameover_pg.html";
        }
    }

    if (document.body.classList.contains("gameover-page")) {
        const didWin = localStorage.getItem("didWin") === "true";
        const timeTaken = localStorage.getItem("timeTaken");
        const stars = parseInt(localStorage.getItem("stars"));

        document.getElementById("result").textContent = didWin ? "YOU WON !!!" : "YOU LOSE !!";
        document.getElementById("time").textContent = "Time Taken: " + timeTaken + "s";

        const starsBox = document.getElementById("stars");
        for (let i = 1; i <= stars; i++) {
            const star = document.createElement("span");
            star.textContent = "⭐";
            star.classList.add("star");
            starsBox.appendChild(star);
        }
    }

});
