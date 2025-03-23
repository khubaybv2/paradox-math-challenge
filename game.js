// বাংলা সংখ্যা কনভার্টার
const numbers = {
    '০':0, '১':1, '২':2, '৩':3, '৪':4, '৫':5, '৬':6, '৭':7, '৮':8, '৯':9
};

let currentGame = {
    mode: null,
    level: 1,
    score: 100,
    time: 300, // 5 minutes in seconds
    timerId: null,
    questions: [],
    currentQuestion: null,
    correctAnswers: 0,
    wrongAnswers: 0
};

// প্রশ্ন জেনারেটর
function generateQuestions(mode, level) {
    let questions = [];
    const operations = getOperations(mode, level);
    
    for(let i=0; i<10; i++) {
        let a = Math.floor(Math.random() * (level * 10)) + 1;
        let b = Math.floor(Math.random() * (level * 5)) + 1;
        let op = operations[Math.floor(Math.random()*operations.length)];
        
        let question = {
            text: `${bnNumber(a)} ${op} ${bnNumber(b)} = ?`,
            answer: calculate(a, b, op)
        };
        
        questions.push(question);
    }
    
    return questions;
}

function getOperations(mode, level) {
    switch(mode) {
        case 'easy': return ['+', '-'];
        case 'standard': return ['×', '÷'];
        case 'hard': return ['√', '²'];
        default: return ['+'];
    }
}

function calculate(a, b, op) {
    switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        case '÷': return (a / b).toFixed(2);
        case '√': return Math.sqrt(a).toFixed(2);
        case '²': return Math.pow(a, 2);
    }
}

// গেম ম্যানেজমেন্ট
function startGame(mode) {
    currentGame.mode = mode;
    currentGame.questions = generateQuestions(mode, currentGame.level);
    loadQuestion();
    startTimer();
    document.getElementById('gamePanel').classList.remove('hidden');
}

function startTimer() {
    currentGame.timerId = setInterval(() => {
        currentGame.time--;
        updateTimerDisplay();
        
        if(currentGame.time <= 0) endGame();
    }, 1000);
}

function loadQuestion() {
    currentGame.currentQuestion = currentGame.questions.shift();
    document.getElementById('question').textContent = currentGame.currentQuestion.text;
}

function checkAnswer() {
    let userAnswer = parseBengali(document.getElementById('answer').value);
    let correctAnswer = currentGame.currentQuestion.answer;
    
    if(userAnswer == correctAnswer) {
        currentGame.score += 20;
        currentGame.correctAnswers++;
    } else {
        currentGame.score = Math.max(0, currentGame.score - 10);
        currentGame.wrongAnswers++;
    }
    
    updateScoreDisplay();
    
    if(currentGame.questions.length > 0) {
        loadQuestion();
    } else {
        showResults();
    }
}

// ইউটিলিটি ফাংশন
function bnNumber(num) {
    return num.toString().replace(/\d/g, m => Object.keys(numbers)[m]);
}

function parseBengali(input) {
    return parseFloat(input.replace(/[০-৯]/g, m => numbers[m]));
}

function convertToBengali(input) {
    input.value = input.value.replace(/\d/g, m => Object.keys(numbers)[m]);
}

function updateTimerDisplay() {
    let minutes = Math.floor(currentGame.time / 60);
    let seconds = currentGame.time % 60;
    document.getElementById('timer').textContent = 
        `${bnNumber(minutes)}:${bnNumber(seconds.toString().padStart(2, '0'))}`;
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = `স্কোর: ${bnNumber(currentGame.score)}`;
    document.getElementById('level').textContent = `লেভেল: ${bnNumber(currentGame.level)}`;
}

function showResults() {
    clearInterval(currentGame.timerId);
    document.getElementById('resultModal').classList.remove('hidden');
    
    let resultHTML = `
        <p>সঠিক উত্তর: ${bnNumber(currentGame.correctAnswers)}</p>
        <p>ভুল উত্তর: ${bnNumber(currentGame.wrongAnswers)}</p>
        <p>চূড়ান্ত স্কোর: ${bnNumber(currentGame.score)}</p>
    `;
    
    document.getElementById('resultStats').innerHTML = resultHTML;
}

function nextLevel() {
    if(currentGame.level < 50) {
        currentGame.level++;
        startGame(currentGame.mode);
        document.getElementById('resultModal').classList.add('hidden');
    }
}

function retryLevel() {
    startGame(currentGame.mode);
    document.getElementById('resultModal').classList.add('hidden');
}

function endGame() {
    clearInterval(currentGame.timerId);
    showResults();
}

// LocalStorage Helpers
function saveProgress() {
    localStorage.setItem('mathGameProgress', JSON.stringify(currentGame));
}

function loadProgress() {
    let saved = localStorage.getItem('mathGameProgress');
    if(saved) currentGame = JSON.parse(saved);
}

// Initialize
window.onload = loadProgress;
window.onbeforeunload = saveProgress;
