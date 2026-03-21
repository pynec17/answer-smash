let questions = [];
let currentIndex = 0;
let score = 0;

// Screens
const menuScreen = document.getElementById("menu-screen");
const howToPlayScreen = document.getElementById("how-to-play-screen");
const gameScreen = document.getElementById("game-screen");

// Game elements
const questionText = document.getElementById("question-text");
const questionImage = document.getElementById("question-image");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const quizArea = document.getElementById("quiz-area");
const summary = document.getElementById("summary");
const scoreValue = document.getElementById("score-value");
const totalValue = document.getElementById("total-value");
const finalScore = document.getElementById("final-score");
const finalTotal = document.getElementById("final-total");

function showScreen(screen) {
    [menuScreen, howToPlayScreen, gameScreen].forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

async function loadQuestions() {
    const response = await fetch("questions.json");
    questions = await response.json();
}

function startGame() {
    currentIndex = 0;
    score = 0;
    scoreValue.textContent = 0;
    shuffle(questions);
    totalValue.textContent = questions.length;
    quizArea.classList.remove("hidden");
    summary.classList.add("hidden");
    showScreen(gameScreen);
    showQuestion();
}

function showQuestion() {
    if (currentIndex >= questions.length) {
        showSummary();
        return;
    }
    const q = questions[currentIndex];
    questionText.textContent = q.question;
    questionImage.src = q.image;
    answerInput.value = "";
    answerInput.disabled = false;
    submitBtn.classList.remove("hidden");
    feedback.textContent = "";
    feedback.className = "";
    nextBtn.classList.add("hidden");
    answerInput.focus();
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    if (!userAnswer) return;

    const correct = questions[currentIndex].answer;
    const isCorrect = userAnswer.toLowerCase() === correct.toLowerCase();

    if (isCorrect) {
        score++;
        scoreValue.textContent = score;
        feedback.textContent = "Correct!";
        feedback.className = "correct";
    } else {
        feedback.textContent = `Incorrect! The answer was: ${correct}`;
        feedback.className = "incorrect";
    }

    answerInput.disabled = true;
    submitBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    nextBtn.focus();
}

function showSummary() {
    quizArea.classList.add("hidden");
    finalScore.textContent = score;
    finalTotal.textContent = questions.length;
    summary.classList.remove("hidden");
}

// Menu navigation
document.getElementById("play-btn").addEventListener("click", startGame);
document.getElementById("how-to-play-btn").addEventListener("click", () => showScreen(howToPlayScreen));
document.getElementById("back-from-help-btn").addEventListener("click", () => showScreen(menuScreen));
document.getElementById("menu-btn").addEventListener("click", () => showScreen(menuScreen));
document.getElementById("summary-menu-btn").addEventListener("click", () => showScreen(menuScreen));
document.getElementById("restart-btn").addEventListener("click", startGame);

// Game controls
submitBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
});
nextBtn.addEventListener("click", () => {
    currentIndex++;
    showQuestion();
});

loadQuestions();
