const cards = [
    { img: "image/fries.jpg" }, { img: "image/fries.jpg" },
    { img: "image/burger.jpg" }, { img: "image/burger.jpg" },
    { img: "image/ice-cream.jpg" }, { img: "image/ice-cream.jpg" },
    { img: "image/pizza.jpg" }, { img: "image/pizza.jpg" },
    { img: "image/milkshake.jpg" }, { img: "image/milkshake.jpg" },
    { img: "image/hotdog.jpg" }, { img: "image/hotdog.jpg" }
];

let firstCard = null, secondCard = null, boardLocked = false, score = 0, matches = 0;
let timer, elapsed = 0, timerStarted = false, start;

document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    initBoard();
    document.getElementById('new-game').addEventListener('click', reset);

    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    document.body.appendChild(alertContainer);
});

function preloadImages() {
    cards.forEach(card => {
        const img = new Image();
        img.src = card.img;
    });
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function initBoard() {
    const board = document.getElementById('board');
    shuffle(cards);
    const fragment = document.createDocumentFragment();
    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        cardEl.dataset.value = card.img;
        cardEl.addEventListener('click', flip);
        fragment.appendChild(cardEl);
    });
    board.appendChild(fragment);
}

function flip() {
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
    checkMatch();
}

function checkMatch() {
    const match = firstCard.dataset.value === secondCard.dataset.value;
    match ? handleMatch() : handleMismatch();
}

function handleMatch() {
    disableCards();
    updateScore(15);
    matches++;
    showMessage("You found a match!");

    if (matches === cards.length / 2) {
        showMessage("Congratulations! You found them all!");
        stopTimer();
    }
}

function handleMismatch() {
    boardLocked = true;
    setTimeout(() => {
        unflipCards();
        resetBoard();
        showMessage("Sorry, try again!");
        updateScore(-10);
    }, 500);
}

function disableCards() {
    firstCard.removeEventListener('click', flip);
    secondCard.removeEventListener('click', flip);
    resetBoard();
}

function unflipCards() {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.style.backgroundImage = 'url(image/cards.jpg)';
    secondCard.style.backgroundImage = 'url(image/cards.jpg)';
}

function resetBoard() {
    [firstCard, secondCard, boardLocked] = [null, null, false];
}

function updateScore(value) {
    score += value;
    const scoreEl = document.getElementById('score');
    scoreEl.textContent = `${score}`;
    updateScoreColor(scoreEl);

    const scoreChangeEl = document.createElement('span');
    scoreChangeEl.textContent = value > 0 ? `+${value}` : `${value}`;
    scoreChangeEl.classList.add('score-change', value > 0 ? 'score-inc' : 'score-dec');
    scoreEl.appendChild(scoreChangeEl);

    const prevChanges = scoreEl.querySelectorAll('.score-change');
    prevChanges.forEach(change => {
        if (change !== scoreChangeEl) {
            change.style.transform = 'translateY(-20px)';
        }
    });

    setTimeout(() => {
        scoreChangeEl.style.opacity = '0';
    }, 1000);
    setTimeout(() => {
        scoreEl.removeChild(scoreChangeEl);
    }, 1500);
}

function updateScoreColor(scoreEl) {
    scoreEl.classList.toggle('positive', score > 0);
    scoreEl.classList.toggle('negative', score < 0);
    scoreEl.classList.toggle('neutral', score === 0);
}

function showMessage(msg) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.classList.add('alert', 'show');

    let color;
    if (msg === "Sorry, try again!") {
        color = 'red';
    } else if (msg === "You found a match!") {
        color = 'blue';
    } else if (msg === "Congratulations! You found them all!") {
        color = 'yellow';
    }
    alert.innerHTML = `<span class="message" style="color: ${color};">${msg}</span>`;

    alertContainer.appendChild(alert);

    const prevAlerts = alertContainer.querySelectorAll('.alert.show');
    prevAlerts.forEach((notif, index) => {
        notif.style.bottom = `${100 + (prevAlerts.length - index - 1) * 60}px`;
    });

    const displayDuration = msg === "Congratulations! You found them all!" ? 10000 : 5000;

    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alertContainer.removeChild(alert);
        }, 300);
    }, displayDuration);
}

function startTimer() {
    start = Date.now();
    const timerEl = document.getElementById('timer');
    timerEl.innerHTML = `Time: <span class="time-black">0.000s</span>`;
    timerEl.classList.add('shake');
    let lastSec = 0;

    timer = setInterval(() => {
        elapsed = (Date.now() - start) / 1000;
        const timeSpan = timerEl.querySelector('span');
        timeSpan.textContent = `${elapsed.toFixed(3)}s`;
        const currSec = Math.floor(elapsed);

        if (elapsed > 10 && currSec !== lastSec && currSec > 10) {
            updateScore(-1);
            lastSec = currSec;
        }

        if (elapsed <= 10) {
            timeSpan.classList.add('time-blue');
            timeSpan.classList.remove('time-red', 'time-black');
        } else {
            timeSpan.classList.add('time-red');
            timeSpan.classList.remove('time-blue', 'time-black');
        }
    }, 110);
}

function stopTimer() {
    clearInterval(timer);
    const timerEl = document.getElementById('timer');
    const timeSpan = timerEl.querySelector('span');
    timeSpan.textContent = `${elapsed.toFixed(3)}s`;
    timerEl.classList.remove('shake');
}

function reset() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    score = 0;
    matches = 0;
    timerStarted = false;

    const scoreEl = document.getElementById('score');
    scoreEl.textContent = `${score}`;
    updateScoreColor(scoreEl);
    document.getElementById('message').textContent = '';
    stopTimer();
    document.getElementById('timer').innerHTML = `Time: <span class="time-black">0.000s</span>`;

    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';

    initBoard();
}