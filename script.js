const cards = [
    { img: "image/fries.jpg" }, { img: "image/fries.jpg" },
    { img: "image/burger.jpg" }, { img: "image/burger.jpg" },
    { img: "image/ice-cream.jpg" }, { img: "image/ice-cream.jpg" },
    { img: "image/pizza.jpg" }, { img: "image/pizza.jpg" },
    { img: "image/milkshake.jpg" }, { img: "image/milkshake.jpg" },
    { img: "image/hotdog.jpg" }, { img: "image/hotdog.jpg" }
];

let firstCard = null, secondCard = null, boardLocked = false, score = 0, matchesFound = 0;
let timerInterval, timeElapsed = 0, timerStarted = false, startTime;

document.addEventListener('DOMContentLoaded', () => {
    initializeGameBoard();
    document.getElementById('new-game-button').addEventListener('click', resetGame);

    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeGameBoard() {
    const gameBoard = document.getElementById('board');
    shuffle(cards);
    const fragment = document.createDocumentFragment();
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card.img;
        cardElement.addEventListener('click', flipCard);
        fragment.appendChild(cardElement);
    });
    gameBoard.appendChild(fragment);
}

function flipCard() {
    if (boardLocked || this === firstCard) return;

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
    updateScore(15);
    matchesFound++;
    displayMessage("You found a match!");

    if (matchesFound === cards.length / 2) {
        displayMessage("Congratulations! You found them all!");
        stopTimer();
    }
}

function handleNoMatch() {
    boardLocked = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.style.backgroundImage = 'url(image/cards.jpg)';
        secondCard.style.backgroundImage = 'url(image/cards.jpg)';
        resetBoard();
        displayMessage("Sorry, try again!");
        updateScore(-10);
    }, 500);
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function resetBoard() {
    [firstCard, secondCard, boardLocked] = [null, null, false];
}

function updateScore(value) {
    score += value;
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `${score}`;
    updateScoreColor(scoreElement);

    const scoreChangeElement = document.createElement('span');
    scoreChangeElement.textContent = value > 0 ? `+${value}` : `${value}`;
    scoreChangeElement.classList.add('score-change', value > 0 ? 'score-increment' : 'score-decrement');
    scoreElement.appendChild(scoreChangeElement);

    const previousChanges = scoreElement.querySelectorAll('.score-change');
    previousChanges.forEach(change => {
        if (change !== scoreChangeElement) {
            change.style.transform = 'translateY(-20px)';
        }
    });

    setTimeout(() => {
        scoreChangeElement.style.opacity = '0';
    }, 1000);
    setTimeout(() => {
        scoreElement.removeChild(scoreChangeElement);
    }, 1500);
}

function updateScoreColor(scoreElement) {
    scoreElement.classList.toggle('positive', score > 0);
    scoreElement.classList.toggle('negative', score < 0);
    scoreElement.classList.toggle('neutral', score === 0);
}

function displayMessage(message) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification', 'show');
    notification.innerHTML = `<span class="message">${message}</span><button class="close-btn">x</button>`;

    notificationContainer.appendChild(notification);

    const closeButton = notification.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    });

    const previousNotifications = notificationContainer.querySelectorAll('.notification.show');
    previousNotifications.forEach((notif, index) => {
        notif.style.bottom = `${100 + (previousNotifications.length - index - 1) * 60}px`;
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}

function startTimer() {
    startTime = Date.now();
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `Time: 0.000s`;
    timerElement.classList.add('shake');
    let lastSecond = 0;

    timerInterval = setInterval(() => {
        timeElapsed = (Date.now() - startTime) / 1000;
        timerElement.textContent = `Time: ${timeElapsed.toFixed(3)}s`;
        const currentSecond = Math.floor(timeElapsed);

        if (timeElapsed > 10 && currentSecond !== lastSecond && currentSecond > 10) {
            updateScore(-1);
            lastSecond = currentSecond;
        }
    }, 110);
}

function stopTimer() {
    clearInterval(timerInterval);
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `Time: ${timeElapsed.toFixed(3)}s`;
    timerElement.classList.remove('shake');
}

function resetGame() {
    const gameBoard = document.getElementById('board');
    gameBoard.innerHTML = '';
    score = 0;
    matchesFound = 0;
    timerStarted = false;

    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `${score}`;
    updateScoreColor(scoreElement);
    document.getElementById('message').textContent = '';
    stopTimer();
    document.getElementById('timer').textContent = `Time: 0.000s`;

    const notificationContainer = document.getElementById('notification-container');
    notificationContainer.innerHTML = '';

    initializeGameBoard();
}