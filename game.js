const Game = {
    config: {
        totalLevels: 10,
        questionsPerLevel: 5,
        baseScore: 10
    },
    
    state: {
        currentUser: '',
        currentMode: '',
        currentLevel: 1,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0
    },

    questions: {
        easy: [],
        medium: [],
        hard: []
    },

    init() {
        this.generateAllQuestions();
        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.state.currentMode = e.currentTarget.dataset.mode;
                this.showGameInterface();
            });
        });
    },

    generateAllQuestions() {
        for (let level = 1; level <= this.config.totalLevels; level++) {
            this.questions.easy.push(...this.createQuestions('easy', level));
            this.questions.medium.push(...this.createQuestions('medium', level));
            this.questions.hard.push(...this.createQuestions('hard', level));
        }
    },

    createQuestions(mode, level) {
        const questions = [];
        const difficulty = level * 5;
        
        for (let i = 0; i < this.config.questionsPerLevel; i++) {
            let question = {};
            const a = Math.floor(Math.random() * difficulty) + 1;
            const b = Math.floor(Math.random() * difficulty) + 1;

            switch (mode) {
                case 'easy':
                    question = this.createBasicQuestion(a, b);
                    break;
                case 'medium':
                    question = this.createIntermediateQuestion(a, b);
                    break;
                case 'hard':
                    question = this.createAdvancedQuestion(a, b);
                    break;
            }
            questions.push(question);
        }
        return questions;
    },

    createBasicQuestion(a, b) {
        const ops = ['+', '-'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const answer = eval(`${a}${op}${b}`);
        const options = this.generateOptions(answer, 10);
        
        return {
            question: `${a} ${op} ${b} = ?`,
            answer: answer,
            options: options
        };
    },

    generateOptions(correctAnswer, range) {
        const options = [correctAnswer];
        while (options.length < 4) {
            const randomValue = correctAnswer + Math.floor(Math.random() * range) - Math.floor(range / 2);
            if (!options.includes(randomValue)) options.push(randomValue);
        }
        return this.shuffleArray(options);
    },

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    },

    showGameInterface() {
        document.getElementById('userSection').classList.add('hidden');
        document.getElementById('modeSection').classList.add('hidden');
        document.getElementById('gameSection').classList.remove('hidden');
        this.loadQuestion();
    },

    loadQuestion() {
        const currentQuestions = this.questions[this.state.currentMode];
        const levelIndex = (this.state.currentLevel - 1) * this.config.questionsPerLevel;
        const currentQuestion = currentQuestions[levelIndex];
        
        document.getElementById('questionText').textContent = currentQuestion.question;
        this.displayOptions(currentQuestion.options, currentQuestion.answer);
    },

    displayOptions(options, correctAnswer) {
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => this.checkAnswer(option, correctAnswer);
            optionsContainer.appendChild(button);
        });
    },

    checkAnswer(selected, correct) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            if (parseInt(btn.textContent) === correct) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('wrong');
            }
            btn.disabled = true;
        });

        if (selected === correct) {
            this.state.score += this.config.baseScore;
            this.state.correctAnswers++;
        } else {
            this.state.wrongAnswers++;
        }

        setTimeout(() => {
            this.showResults();
        }, 1500);
    },

    showResults() {
        document.getElementById('correctAnswers').textContent = this.state.correctAnswers;
        document.getElementById('wrongAnswers').textContent = this.state.wrongAnswers;
        document.getElementById('totalScore').textContent = this.state.score;
        document.getElementById('resultSection').classList.remove('hidden');
    },

    nextLevel() {
        if (this.state.currentLevel < this.config.totalLevels) {
            this.state.currentLevel++;
            this.loadQuestion();
            document.getElementById('resultSection').classList.add('hidden');
        }
    },

    restartGame() {
        this.state.currentLevel = 1;
        this.state.score = 0;
        this.state.correctAnswers = 0;
        this.state.wrongAnswers = 0;
        this.showGameInterface();
    }
};

// Initialize Game
window.startGameFlow = () => {
    const username = document.getElementById('username').value;
    if (username) {
        Game.state.currentUser = username;
        document.getElementById('userGreeting').textContent = `স্বাগতম, ${username}!`;
        document.getElementById('userSection').classList.add('hidden');
        document.getElementById('modeSection').classList.remove('hidden');
    }
};

window.nextLevel = () => Game.nextLevel();
window.restartGame = () => Game.restartGame();

Game.init();
