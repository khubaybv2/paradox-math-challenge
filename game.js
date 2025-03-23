class MathGame {
    constructor() {
        this.userName = '';
        this.currentMode = null;
        this.currentLevel = 1;
        this.score = 100;
        this.timeLeft = 300;
        this.timerId = null;
        this.questions = [];
        this.currentQuestion = null;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.totalLevels = 50;
        this.lives = 3;
    }

    initializeGame() {
        this.setupEventListeners();
        this.loadTheme();
    }

    setupEventListeners() {
        document.getElementById('themeSwitch').addEventListener('change', (e) => {
            document.body.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
            localStorage.setItem('gameTheme', e.target.checked ? 'dark' : 'light');
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('gameTheme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        document.getElementById('themeSwitch').checked = savedTheme === 'dark';
    }

    handleUserStart() {
        const nameInput = document.getElementById('userName').value.trim();
        if (!nameInput) return this.showError('নাম ইনপুট দিন');
        
        this.userName = nameInput;
        this.toggleSections('userSection', 'levelSection');
        document.getElementById('welcomeMsg').textContent = `${nameInput}, মোড নির্বাচন করুন`;
    }

    selectMode(mode) {
        this.currentMode = mode;
        this.prepareGame();
        this.toggleSections('levelSection', 'gameSection');
        this.startGame();
    }

    prepareGame() {
        this.questions = this.generateQuestions();
        this.resetGameState();
        this.updateProgress();
        this.updateUI();
    }

    generateQuestions() {
        // Advanced question generation logic
        const questions = [];
        const difficulty = this.currentLevel * 5;
        
        for(let i = 0; i < 10; i++) {
            let question = {};
            const a = Math.floor(Math.random() * difficulty) + 1;
            const b = Math.floor(Math.random() * difficulty) + 1;
            
            switch(this.currentMode) {
                case 'easy':
                    question = this.createBasicQuestion(a, b);
                    break;
                case 'standard':
                    question = this.createIntermediateQuestion(a, b);
                    break;
                case 'hard':
                    question = this.createAdvancedQuestion(a);
                    break;
            }
            questions.push(question);
        }
        return questions;
    }

    startGame() {
        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if(this.timeLeft <= 0) this.handleTimeOut();
        }, 1000);
        
        this.loadNextQuestion();
    }

    checkAnswer() {
        const userAnswer = this.parseAnswer(document.getElementById('answerInput').value);
        const isCorrect = this.validateAnswer(userAnswer);
        
        isCorrect ? this.handleCorrect() : this.handleWrong();
        this.loadNextQuestion();
    }

    showResults() {
        // Advanced result display logic
        this.toggleModal(true);
        this.updateResultStats();
    }

    toggleSections(hideId, showId) {
        document.getElementById(hideId).classList.add('hidden');
        document.getElementById(showId).classList.remove('hidden');
    }

    // ... 30+ more methods for complete functionality ...
}

// Initialize Game
const game = new MathGame();
game.initializeGame();
