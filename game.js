const MathGame = {
    config: {
        levelsPerMode: 10,
        questionsPerLevel: 10,
        baseTime: 300 // 5 minutes in seconds
    },

    state: {
        currentUser: "",
        currentMode: "",
        currentLevel: 1,
        score: 100,
        timeLeft: 0,
        timerId: null,
        questions: [],
        currentQuestion: null,
        correctAnswers: 0,
        wrongAnswers: 0
    },

    // প্রশ্ন জেনারেটর
    generateQuestions(mode, level) {
        const questions = [];
        const difficulty = level * 5;
        
        for(let i = 0; i < this.config.questionsPerLevel; i++) {
            let question = {};
            const a = Math.floor(Math.random() * difficulty) + 1;
            const b = Math.floor(Math.random() * difficulty) + 1;

            switch(mode) {
                case 'easy':
                    question = this.createBasicQuestion(a, b);
                    break;
                case 'standard':
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
        return {
            question: `${this.toBengali(a)} ${op} ${this.toBengali(b)} = ?`,
            answer: eval(`${a}${op}${b}`)
        };
    },

    createIntermediateQuestion(a, b) {
        const ops = ['×', '÷'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let answer;
        
        if(op === '×') {
            answer = a * b;
        } else {
            a = a * b; // Ensure divisible
            answer = a / b;
        }
        
        return {
            question: `${this.toBengali(a)} ${op} ${this.toBengali(b)} = ?`,
            answer: answer
        };
    },

    createAdvancedQuestion(a, b) {
        const types = ['algebra', 'exponent'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if(type === 'algebra') {
            const result = a + b;
            return {
                question: `${this.toBengali(a)} + x = ${this.toBengali(result)}`,
                answer: b
            };
        } else {
            return {
                question: `${this.toBengali(a)}² + ${this.toBengali(b)} = ?`,
                answer: Math.pow(a, 2) + b
            };
        }
    },

    // গেম কন্ট্রোল
    startGame(mode) {
        this.state.currentMode = mode;
        this.state.questions = this.generateQuestions(mode, this.state.currentLevel);
        this.state.timeLeft = this.config.baseTime;
        this.updateDisplay();
        this.startTimer();
        this.showNextQuestion();
    },

    startTimer() {
        this.state.timerId = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();
            
            if(this.state.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    },

    checkAnswer() {
        const userAnswer = this.parseBengali(document.getElementById('answerInput').value);
        const correctAnswer = this.state.currentQuestion.answer;
        
        if(parseFloat(userAnswer) === parseFloat(correctAnswer)) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
        
        if(this.state.questions.length > 0) {
            this.showNextQuestion();
        } else {
            this.showResults();
        }
    },

    // হেল্পার ফাংশন
    toBengali(number) {
        return number.toString().replace(/\d/g, m => '০১২৩৪৫৬৭৮৯'[m]);
    },

    parseBengali(input) {
        return parseFloat(input.replace(/[০-৯]/g, m => '০১২৩৪৫৬৭৮৯'.indexOf(m)));
    },

    convertToBengali(input) {
        input.value = input.value.replace(/\d/g, m => this.toBengali(m));
    },

    // UI আপডেট ফাংশন
    updateDisplay() {
        document.getElementById('currentLevel').textContent = 
            `লেভেল ${this.toBengali(this.state.currentLevel)}`;
        document.getElementById('gameProgress').value = this.state.currentLevel;
        document.getElementById('score').textContent = 
            `স্কোর: ${this.toBengali(this.state.score)}`;
    },

    updateTimerDisplay() {
        const minutes = Math.floor(this.state.timeLeft / 60);
        const seconds = this.state.timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${this.toBengali(minutes)}:${this.toBengali(seconds.toString().padStart(2, '0'))}`;
    }
};

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    // ইভেন্ট লিসেনার যোগ করুন
    window.handleUserStart = () => {
        const username = document.getElementById('userName').value.trim();
        if(username) {
            MathGame.state.currentUser = username;
            document.getElementById('welcomeMsg').textContent = 
                `স্বাগতম, ${username}! মোড নির্বাচন করুন`;
        }
    };
    
    window.startGame = (mode) => MathGame.startGame(mode);
    window.checkAnswer = () => MathGame.checkAnswer();
});
