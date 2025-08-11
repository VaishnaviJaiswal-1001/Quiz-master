const quizQuestions = {
    music: [
        {
            question: "Which band released the album 'Abbey Road' in 1969?",
            options: ["The Beatles", "The Rolling Stones", "Led Zeppelin", "Pink Floyd"],
            correct: 0
        },
        {
            question: "What instrument did Jimi Hendrix famously play?",
            options: ["Bass Guitar", "Drums", "Electric Guitar", "Piano"],
            correct: 2
        },
        {
            question: "Which composer wrote 'The Four Seasons'?",
            options: ["Bach", "Mozart", "Vivaldi", "Beethoven"],
            correct: 2
        },
        {
            question: "What does 'BPM' stand for in music?",
            options: ["Beats Per Minute", "Bass Per Measure", "Bars Per Movement", "Band Per Music"],
            correct: 0
        },
        {
            question: "Which singer is known as the 'Queen of Pop'?",
            options: ["Whitney Houston", "Madonna", "Mariah Carey", "Celine Dion"],
            correct: 1
        }
    ],
    games: [
        {
            question: "In which year was the original Super Mario Bros. released?",
            options: ["1983", "1985", "1987", "1989"],
            correct: 1
        },
        {
            question: "What is the best-selling video game of all time?",
            options: ["Tetris", "Minecraft", "Grand Theft Auto V", "Fortnite"],
            correct: 1
        },
        {
            question: "Which company developed the game 'The Legend of Zelda'?",
            options: ["Sony", "Microsoft", "Nintendo", "Sega"],
            correct: 2
        },
        {
            question: "What is the main character's name in the Halo series?",
            options: ["Master Chief", "Commander Shepard", "Marcus Fenix", "Solid Snake"],
            correct: 0
        },
        {
            question: "In which game would you find the character 'GLaDOS'?",
            options: ["Half-Life", "Portal", "Bioshock", "System Shock"],
            correct: 1
        }
    ],
    general: [
        {
            question: "What is the capital of Australia?",
            options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
            correct: 2
        },
        {
            question: "How many continents are there?",
            options: ["5", "6", "7", "8"],
            correct: 2
        },
        {
            question: "What is the largest planet in our solar system?",
            options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
            correct: 1
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correct: 2
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correct: 2
        }
    ],
    movies: [
        {
            question: "Which movie won the Academy Award for Best Picture in 2020?",
            options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
            correct: 2
        },
        {
            question: "Who directed the movie 'Inception'?",
            options: ["Steven Spielberg", "Christopher Nolan", "Quentin Tarantino", "Martin Scorsese"],
            correct: 1
        },
        {
            question: "In which movie would you hear the quote 'May the Force be with you'?",
            options: ["Star Trek", "Star Wars", "Guardians of the Galaxy", "Interstellar"],
            correct: 1
        },
        {
            question: "What is the highest-grossing film of all time?",
            options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars: The Force Awakens"],
            correct: 2
        },
        {
            question: "Who played the character of Jack Sparrow in Pirates of the Caribbean?",
            options: ["Orlando Bloom", "Johnny Depp", "Geoffrey Rush", "Keira Knightley"],
            correct: 1
        }
    ]
};
class QuizGame {
    constructor() {
        this.currentUser = '';
        this.currentCategory = '';
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = 30;
        this.timerInterval = null;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.preloadSounds();
        this.showScreen('loginScreen');
    }
    
    bindEvents() {
        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Category card clicks
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                this.startQuiz(category);
            });
            
            // Add mouse enter/leave events for better 3D interaction
            card.addEventListener('mouseenter', () => {
                document.querySelector('.card-circle').style.animationPlayState = 'paused';
            });
            
            card.addEventListener('mouseleave', () => {
                document.querySelector('.card-circle').style.animationPlayState = 'running';
            });
        });
        
        // Results buttons
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.restartQuiz();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.backToMainMenu();
        });
    }
    
    preloadSounds() {
        // Create audio context for better sound control
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.correctSound = document.getElementById('correctSound');
        this.wrongSound = document.getElementById('wrongSound');
    }
    
    playSound(type) {
        try {
            if (type === 'correct') {
                this.correctSound.currentTime = 0;
                this.correctSound.play().catch(e => console.log('Audio play failed:', e));
            } else if (type === 'wrong') {
                this.wrongSound.currentTime = 0;
                this.wrongSound.play().catch(e => console.log('Audio play failed:', e));
            }
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    }
    
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        if (username) {
            this.currentUser = username;
            document.getElementById('playerName').textContent = username;
            this.showScreen('mainScreen');
            this.animateLoginTransition();
        }
    }
    
    animateLoginTransition() {
        const loginCard = document.querySelector('.login-card');
        loginCard.style.transform = 'translateY(-100vh) rotate(10deg)';
        loginCard.style.opacity = '0';
    }
    
    startQuiz(category) {
        this.currentCategory = category;
        this.currentQuestions = [...quizQuestions[category]];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        
        this.shuffleArray(this.currentQuestions);
        this.setupQuizScreen();
        this.showScreen('quizScreen');
        this.displayQuestion();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    setupQuizScreen() {
        const categoryData = {
            music: { name: 'Music', icon: 'fas fa-music' },
            games: { name: 'Games', icon: 'fas fa-gamepad' },
            general: { name: 'General Knowledge', icon: 'fas fa-lightbulb' },
            movies: { name: 'Movies', icon: 'fas fa-film' }
        };
        
        const category = categoryData[this.currentCategory];
        document.getElementById('categoryName').textContent = category.name;
        document.getElementById('categoryIcon').className = category.icon;
        
        this.updateProgress();
    }
    
    displayQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        // Update question counter
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        
        // Display question
        document.getElementById('questionText').textContent = question.question;
        
        // Create options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(button);
        });
        
        // Start timer
        this.startTimer();
        
        // Animate question entrance
        this.animateQuestionEntrance();
    }
    
    animateQuestionEntrance() {
        const questionText = document.getElementById('questionText');
        const options = document.querySelectorAll('.option-btn');
        
        questionText.style.transform = 'translateY(-30px)';
        questionText.style.opacity = '0';
        
        setTimeout(() => {
            questionText.style.transform = 'translateY(0)';
            questionText.style.opacity = '1';
            questionText.style.transition = 'all 0.5s ease';
        }, 100);
        
        options.forEach((option, index) => {
            option.style.transform = 'translateX(-50px)';
            option.style.opacity = '0';
            
            setTimeout(() => {
                option.style.transform = 'translateX(0)';
                option.style.opacity = '1';
                option.style.transition = 'all 0.3s ease';
            }, 200 + (index * 100));
        });
    }
    
    startTimer() {
        this.timer = 30;
        const timerText = document.getElementById('timerText');
        const timerProgress = document.getElementById('timerProgress');
        const circumference = 2 * Math.PI * 45;
        
        timerProgress.style.strokeDasharray = circumference;
        timerProgress.style.strokeDashoffset = 0;
        
        this.timerInterval = setInterval(() => {
            this.timer--;
            timerText.textContent = this.timer;
            
            const progress = (30 - this.timer) / 30;
            const offset = circumference * progress;
            timerProgress.style.strokeDashoffset = offset;
            
            // Change color as timer runs out
            if (this.timer <= 10) {
                timerProgress.style.stroke = '#FF6B6B';
                timerText.style.color = '#FF6B6B';
            } else if (this.timer <= 20) {
                timerProgress.style.stroke = '#FFA726';
                timerText.style.color = '#FFA726';
            }
            
            if (this.timer <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    timeUp() {
        clearInterval(this.timerInterval);
        this.wrongAnswers++;
        this.playSound('wrong');
        this.disableAllOptions();
        this.highlightCorrectAnswer();
        setTimeout(() => this.nextQuestion(), 2000);
    }
    
    selectAnswer(selectedIndex) {
        clearInterval(this.timerInterval);
        
        const question = this.currentQuestions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');
        const selectedOption = options[selectedIndex];
        
        this.disableAllOptions();
        
        if (selectedIndex === question.correct) {
            selectedOption.classList.add('correct');
            this.score++;
            this.correctAnswers++;
            this.playSound('correct');
            this.animateCorrectAnswer(selectedOption);
        } else {
            selectedOption.classList.add('wrong');
            this.wrongAnswers++;
            this.playSound('wrong');
            this.highlightCorrectAnswer();
            this.animateWrongAnswer(selectedOption);
        }
        
        setTimeout(() => this.nextQuestion(), 2000);
    }
    
    disableAllOptions() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.add('disabled');
            btn.style.pointerEvents = 'none';
        });
    }
    
    highlightCorrectAnswer() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');
        options[question.correct].classList.add('correct');
    }
    
    animateCorrectAnswer(element) {
        element.style.transform = 'scale(1.1)';
        element.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.6)';
    }
    
    animateWrongAnswer(element) {
        element.style.transform = 'scale(0.95)';
        element.style.boxShadow = '0 0 30px rgba(255, 107, 107, 0.6)';
        
        // Shake animation
        element.style.animation = 'shake 0.5s ease-in-out';
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.currentQuestions.length) {
            this.updateProgress();
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex) / this.currentQuestions.length) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
    }
    
    endQuiz() {
        this.displayResults();
        this.showScreen('resultsScreen');
    }
    
    displayResults() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctCount').textContent = this.correctAnswers;
        document.getElementById('wrongCount').textContent = this.wrongAnswers;
        
        // Set trophy based on score
        const trophyIcon = document.querySelector('.trophy-icon');
        if (this.score >= 4) {
            trophyIcon.className = 'fas fa-trophy trophy-icon gold';
        } else if (this.score >= 3) {
            trophyIcon.className = 'fas fa-trophy trophy-icon silver';
        } else {
            trophyIcon.className = 'fas fa-trophy trophy-icon bronze';
        }
        
        this.animateScoreDisplay();
    }
    
    animateScoreDisplay() {
        const scoreText = document.getElementById('finalScore');
        let currentScore = 0;
        
        const scoreAnimation = setInterval(() => {
            if (currentScore <= this.score) {
                scoreText.textContent = currentScore;
                currentScore++;
            } else {
                clearInterval(scoreAnimation);
            }
        }, 200);
    }
    
    restartQuiz() {
        this.startQuiz(this.currentCategory);
    }
    
    backToMainMenu() {
        this.showScreen('mainScreen');
        this.currentCategory = '';
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        setTimeout(() => {
            document.getElementById(screenId).classList.add('active');
        }, 100);
    }
}

// Add shake animation to CSS
const shakeKeyframes = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;

const style = document.createElement('style');
style.textContent = shakeKeyframes;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
});

// Handle audio context for mobile devices
document.addEventListener('touchstart', function() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
}, { once: true });