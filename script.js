const cards = [
    { img: "image/fries.jpg" }, { img: "image/fries.jpg" },
    { img: "image/burger.jpg" }, { img: "image/burger.jpg" },
    { img: "image/ice-cream.jpg" }, { img: "image/ice-cream.jpg" },
    { img: "image/pizza.jpg" }, { img: "image/pizza.jpg" },
    { img: "image/milkshake.jpg" }, { img: "image/milkshake.jpg" },
    { img: "image/hotdog.jpg" }, { img: "image/hotdog.jpg" }
];

let firstCard = null, secondCard = null, lockBoard = false, score = 0, matchesFound = 0;
let timerInterval, timeElapsed = 0, timerStarted = false, startTime;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createGameBoard() {
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
        startGameTimer();
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
    updateGameScore(1);
    matchesFound++;
    updateGameMessage("You found a match!");
    if (matchesFound === cards.length / 2) {
        updateGameMessage("Congratulations! You found them all!");
        stopGameTimer();
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
        updateGameMessage("Sorry, try again!");
        updateGameScore(-1);
    }, 500);
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateGameScore(value) {
    score += value;
    const scoreElement = document.getElementById('game-score');
    scoreElement.textContent = `${score}`;
    updateScoreColor(scoreElement);

    const scoreChangeElement = document.createElement('span');
    scoreChangeElement.textContent = value > 0 ? `+${value}` : `${value}`;
    scoreChangeElement.classList.add(value > 0 ? 'score-increment' : 'score-decrement');
    scoreElement.appendChild(scoreChangeElement);
}

function updateScoreColor(scoreElement) {
    scoreElement.classList.toggle('positive', score > 0);
    scoreElement.classList.toggle('negative', score < 0);
    scoreElement.classList.toggle('neutral', score === 0);
}

function updateGameMessage(message) {
    document.getElementById('game-message').textContent = message;
}

function startGameTimer() {
    startTime = Date.now();
    const timerElement = document.getElementById('game-timer');
    timerElement.textContent = `Time: 0.000s`;
    timerElement.classList.add('shake');
    timerInterval = setInterval(() => {
        timeElapsed = (Date.now() - startTime) / 1000;
        timerElement.textContent = `Time: ${timeElapsed.toFixed(3)}s`;
    }, 10);
}

function stopGameTimer() {
    clearInterval(timerInterval);
    const timerElement = document.getElementById('game-timer');
    timerElement.textContent = `Time: ${timeElapsed.toFixed(3)}s`;
    timerElement.classList.remove('shake');
}

function resetGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    score = 0;
    matchesFound = 0;
    timerStarted = false;
    const scoreElement = document.getElementById('game-score');
    scoreElement.textContent = `${score}`;
    updateScoreColor(scoreElement);
    document.getElementById('game-message').textContent = '';
    stopGameTimer();
    document.getElementById('game-timer').textContent = `Time: 0.000s`;
    createGameBoard();
}

function createSnowflakes(type, count, color) {
    for (let i = 0; i < count; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add(type);
        snowflake.style.width = `${Math.random() * 10 + 5}px`;
        snowflake.style.height = snowflake.style.width;
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 3}s`;
        snowflake.style.animationDelay = `${Math.random() * 5}s`;
        snowflake.style.border = `2px solid ${color}`;
        document.body.appendChild(snowflake);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
    document.getElementById('new-game-btn').addEventListener('click', resetGame);
    createSnowflakes('snowflake-fall', 20, 'blue');
    createSnowflakes('snowflake-rise', 10, 'red');
});