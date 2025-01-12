const cards = [
    { img: "image/fries.jpg" }, { img: "image/fries.jpg" },
    { img: "image/burger.jpg" }, { img: "image/burger.jpg" },
    { img: "image/ice-cream.jpg" }, { img: "image/ice-cream.jpg" },
    { img: "image/pizza.jpg" }, { img: "image/pizza.jpg" },
    { img: "image/milkshake.jpg" }, { img: "image/milkshake.jpg" },
    { img: "image/hotdog.jpg" }, { img: "image/hotdog.jpg" }
];

let firstCard = null, secondCard = null, lockBoard = false, score = 0, matchesFound = 0;
let timerInterval, timeElapsed = 0, timerStarted = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card.img;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    this.classList.add('flipped');
    this.style.backgroundImage = `url(${this.dataset.value})`;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;
    isMatch ? handleMatch() : handleNoMatch();
}

function handleMatch() {
    disableCards();
    updateScore();
    matchesFound++;
    updateMessage("You found a match!");
    if (matchesFound === cards.length / 2) {
        updateMessage("Congratulations! You found them all!");
        stopTimer();
    }
}

function handleNoMatch() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.style.backgroundImage = 'url(image/cards.jpg)';
        secondCard.style.backgroundImage = 'url(image/cards.jpg)';
        resetBoard();
        updateMessage("Sorry, try again!");
    }, 1000);
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateScore() {
    score++;
    document.getElementById('score').textContent = `Score: ${score}`;
}

function updateMessage(message) {
    document.getElementById('message').textContent = message;
}

function startTimer() {
    timeElapsed = 0;
    document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    score = 0;
    matchesFound = 0;
    timerStarted = false;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('message').textContent = '';
    stopTimer();
    document.getElementById('timer').textContent = `Time: 0s`;
    createBoard();
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    document.getElementById('reset-button').addEventListener('click', resetGame);
});