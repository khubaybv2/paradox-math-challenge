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

    // গেম ইনিশিয়ালাইজেশন
    init() {
        this.loadProgress(); // সংরক্ষিত ডেটা লোড করুন
        this.generateAllQuestions();
        this.bindEvents();
        this.updateUserGreeting();
    },

    // LocalStorage থেকে ডেটা লোড
    loadProgress() {
        const savedData = localStorage.getItem('mathMasterProgress');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            this.state = { ...this.state, ...parsedData };
        }
    },

    // LocalStorage এ ডেটা সেভ
    saveProgress() {
        const dataToSave = {
            currentUser: this.state.currentUser,
            currentMode: this.state.currentMode,
            currentLevel: this.state.currentLevel,
            score: this.state.score,
            correctAnswers: this.state.correctAnswers,
            wrongAnswers: this.state.wrongAnswers
        };
        localStorage.setItem('mathMasterProgress', JSON.stringify(dataToSave));
    },

    // ব্যবহারকারীর নাম আপডেট
    updateUserGreeting() {
        if (this.state.currentUser) {
            document.getElementById('userGreeting').textContent = 
                `স্বাগতম, ${this.state.currentUser}!`;
            document.getElementById('userSection').classList.add('hidden');
            document.getElementById('modeSection').classList.remove('hidden');
        }
    },

    // ইভেন্ট বাইন্ডিং
    bindEvents() {
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.state.currentMode = e.currentTarget.dataset.mode;
                this.showGameInterface();
            });
        });
    },

    // সমস্ত প্রশ্ন জেনারেট করুন
    generateAllQuestions() {
        for (let level = 1; level <= this.config.totalLevels; level++) {
            this.questions.easy = [...this.questions.easy, ...this.createQuestions('easy', level)];
            this.questions.medium = [...this.questions.medium, ...this.createQuestions('medium', level)];
            this.questions.hard = [...this.questions.hard, ...this.createQuestions('hard', level)];
        }
    },

    // প্রশ্ন তৈরি করুন
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

    // সহজ প্রশ্ন তৈরি করুন
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

    // মাধ্যমিক প্রশ্ন তৈরি করুন
    createIntermediateQuestion(a, b) {
        const ops = ['×', '÷'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let answer;
        
        if (op === '×') {
            answer = a * b;
        } else {
            a = a * b; // বিভাজ্য নিশ্চিত করুন
            answer = a / b;
        }
        
        return {
            question: `${a} ${op} ${b} = ?`,
            answer: answer,
            options: this.generateOptions(answer, 15)
        };
    },

    // কঠিন প্রশ্ন তৈরি করুন
    createAdvancedQuestion(a, b) {
        const types = ['algebra', 'exponent'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'algebra') {
            const result = a + b;
            return {
                question: `${a} + x = ${result}`,
                answer: b,
                options: this.generateOptions(b, 20)
            };
        } else {
            return {
                question: `${a}² + ${b} = ?`,
                answer: Math.pow(a, 2) + b,
                options: this.generateOptions(Math.pow(a, 2) + b, 25)
            };
        }
    },

    // MCQ অপশন তৈরি করুন
    generateOptions(correctAnswer, range) {
        const options = [correctAnswer];
        while (options.length < 4) {
            const randomValue = correctAnswer + Math.floor(Math.random() * range) - Math.floor(range / 2);
            if (!options.includes(randomValue)) options.push(randomValue);
        }
        return this.shuffleArray(options);
    },

    // অ্যারে শাফল করুন
    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    },

    // গেম ইন্টারফেস দেখান
    showGameInterface() {
        document.getElementById('userSection').classList.add('hidden');
        document.getElementById('modeSection').classList.add('hidden');
        document.getElementById('gameSection').classList.remove('hidden');
        this.loadQuestion();
    },

    // প্রশ্ন লোড করুন
    loadQuestion() {
        const currentQuestions = this.questions[this.state.currentMode];
        const levelIndex = (this.state.currentLevel - 1) * this.config.questionsPerLevel;
        const currentQuestion = currentQuestions[levelIndex];
        
        document.getElementById('questionText').textContent = currentQuestion.question;
        document.getElementById('currentScore').textContent = this.state.score;
        document.getElementById('currentLevel').textContent = this.state.currentLevel;
        this.displayOptions(currentQuestion.options, currentQuestion.answer);
        this.saveProgress(); // অগ্রগতি সেভ করুন
    },

    // MCQ অপশন দেখান
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

    // উত্তর চেক করুন
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
        
        this.saveProgress(); // পরিবর্তনগুলি সেভ করুন
        setTimeout(() => this.showResults(), 1500);
    },

    // ফলাফল দেখান
    showResults() {
        document.getElementById('correctAnswers').textContent = this.state.correctAnswers;
        document.getElementById('wrongAnswers').textContent = this.state.wrongAnswers;
        document.getElementById('totalScore').textContent = this.state.score;
        document.getElementById('resultSection').classList.remove('hidden');
    },

    // পরবর্তী লেভেলে যান
    nextLevel() {
        if (this.state.currentLevel < this.config.totalLevels) {
            this.state.currentLevel++;
            this.loadQuestion();
            document.getElementById('resultSection').classList.add('hidden');
            this.saveProgress();
        } else {
            alert('আপনি সমস্ত লেভেল সম্পন্ন করেছেন! 🎉');
            this.restartGame();
        }
    },

    // গেম রিসেট করুন
    restartGame() {
        localStorage.removeItem('mathMasterProgress');
        this.state = {
            currentUser: this.state.currentUser, // নাম রিটেইন করুন
            currentMode: '',
            currentLevel: 1,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0
        };
        this.saveProgress();
        this.showGameInterface();
    }
};

// গেম শুরু করুন
window.startGameFlow = () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        Game.state.currentUser = username;
        Game.saveProgress();
        Game.updateUserGreeting();
    }
};

window.nextLevel = () => Game.nextLevel();
window.restartGame = () => Game.restartGame();

Game.init();
