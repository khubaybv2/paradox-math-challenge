// বাংলা সংখ্যা কনভার্টার
const numbers = {
    '০':0, '১':1, '২':2, '৩':3, '৪':4, '৫':5, '৬':6, '৭':7, '৮':8, '৯':9
};

let currentGame = {
    username: '',
    mode: null,
    level: 1,
    score: 100,
    time: 300,
    timerId: null,
    questions: [],
    currentQuestion: null,
    correctAnswers: 0,
    wrongAnswers: 0,
    lives: 3
};

// ইউজারনেম ম্যানেজমেন্ট
function saveUsername() {
    const username = document.getElementById('username').value.trim();
    if(!username) return alert('নাম লিখতে ভুলে গেছেন!');
    
    currentGame.username = username;
    document.getElementById('userForm').classList.add('hidden');
    document.getElementById('levelSelect').classList.remove('hidden');
    document.getElementById('greeting').textContent = `${username}, গেম মোড নির্বাচন করুন`;
}

// গেম ইনিশিয়ালাইজেশন
function startGame(mode) {
    currentGame.mode = mode;
    currentGame.questions = generateQuestions(mode, currentGame.level);
    resetGameState();
    
    document.getElementById('levelSelect').classList.add('hidden');
    document.getElementById('gamePanel').classList.remove('hidden');
    
    startTimer();
    loadQuestion();
}

function resetGameState() {
    currentGame.time = 300;
    currentGame.correctAnswers = 0;
    currentGame.wrongAnswers = 0;
    currentGame.lives = 3;
    updateLivesDisplay();
    updateScoreDisplay();
    updateTimerDisplay();
}

// টাইমার ম্যানেজমেন্ট
function startTimer() {
    clearInterval(currentGame.timerId);
    currentGame.timerId = setInterval(() => {
        currentGame.time--;
        updateTimerDisplay();
        
        if(currentGame.time <= 0) endGame();
    }, 1000);
}

// প্রশ্ন জেনারেটর
function generateQuestions(mode, level) {
    let questions = [];
    const maxNumber = level * 15;
    
    for(let i=0; i<10; i++) {
        let a = Math.floor(Math.random() * maxNumber) + 1;
        let b = Math.floor(Math.random() * maxNumber) + 1;
        let op = getOperation(mode);
        
        let question = {
            text: `${bnNumber(a)} ${op.symbol} ${op.type === 'binary' ? bnNumber(b) : ''} = ?`,
            answer: calculate(a, b, op.fn)
        };
        
        questions.push(question);
    }
    return questions;
}

function getOperation(mode) {
    const operations = {
        easy: [
            { symbol: '+', fn: (a,b) => a+b },
            { symbol: '-', fn: (a,b) => a-b }
        ],
        standard: [
            { symbol: '×', fn: (a,b) => a*b },
            { symbol: '÷', fn: (a,b) => (a/b).toFixed(2) }
        ],
        hard: [
            { symbol: '√', fn: (a) => Math.sqrt(a).toFixed(2), type: 'unary' },
            { symbol: '²', fn: (a) => Math.pow(a, 2), type: 'unary' }
        ]
    };
    return operations[mode][Math.floor(Math.random()*operations[mode].length)];
}

// উত্তর যাচাই
function checkAnswer() {
    const userAnswer = parseBengali(document.getElementById('answer').value);
    const correctAnswer = currentGame.currentQuestion.answer;
    
    if(Math.abs(userAnswer - correctAnswer) < 0.01) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
    
    if(currentGame.questions.length > 0) {
        loadQuestion();
    } else {
        showResults();
    }
}

function handleCorrectAnswer() {
    currentGame.score += 20;
    currentGame.correctAnswers++;
    updateScoreDisplay();
}

function handleWrongAnswer() {
    currentGame.score = Math.max(0, currentGame.score - 10);
    currentGame.wrongAnswers++;
    currentGame.lives--;
    updateScoreDisplay();
    updateLivesDisplay();
    
    if(currentGame.lives <= 0) endGame();
}

// UI আপডেট ফাংশন
function updateLivesDisplay() {
    document.getElementById('lives').textContent = '❤️'.repeat(currentGame.lives);
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = `স্কোর: ${bnNumber(currentGame.score)}`;
    document.getElementById('level').textContent = `লেভেল: ${bnNumber(currentGame.level)}`;
}

// লেভেল ম্যানেজমেন্ট
function nextLevel() {
    if(currentGame.level < 50) {
        currentGame.level++;
        startGame(currentGame.mode);
        document.getElementById('resultModal').classList.add('hidden');
    }
}

function retryLevel() {
    currentGame.lives = 3;
    startGame(currentGame.mode);
    document.getElementById('resultModal').classList.add('hidden');
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
