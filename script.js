// Master Variables
let currentSurprise = 1;
const totalSurprises = 5;
let unlockedSurprises = [1]; // Start with first surprise unlocked

// Surprise Game Variables
let collectedWords = 0;
const totalWords = 8;
const specialWords = ["Kindness", "Lucky", "Peace", "Warmth", "Intelligence", "Hope", "Happiness", "Talent"];

let puzzleSolved = 0;
const totalPuzzlePieces = 12;

let memoryPairs = 0;
const totalMemoryPairs = 6;
let flippedCards = [];
let canFlip = true;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const loadingCountdown = document.getElementById('countdownTimer');
const loadingProgressBar = document.getElementById('loadingProgressBar');
const loadingMessage = document.getElementById('loadingMessage');
const masterContainer = document.getElementById('masterContainer');
const celebrationMessage = document.getElementById('celebrationMessage');
const celebrationText = document.getElementById('celebrationText');
const unlockAnimation = document.getElementById('unlockAnimation');
const unlockText = document.getElementById('unlockText');
const unlockDescription = document.getElementById('unlockDescription');
const secretMessageBtn = document.getElementById('secretMessageBtn');
const continueBtn = document.getElementById('continueBtn');

// Navigation Buttons
const navButtons = {
    prevBtn1: document.getElementById('prevBtn1'),
    nextBtn1: document.getElementById('nextBtn1'),
    prevBtn2: document.getElementById('prevBtn2'),
    nextBtn2: document.getElementById('nextBtn2'),
    prevBtn3: document.getElementById('prevBtn3'),
    nextBtn3: document.getElementById('nextBtn3'),
    prevBtn4: document.getElementById('prevBtn4'),
    nextBtn4: document.getElementById('nextBtn4'),
    prevBtn5: document.getElementById('prevBtn5'),
    nextBtn5: document.getElementById('nextBtn5')
};

// Progress Markers
const markers = {
    marker1: document.getElementById('marker1'),
    marker2: document.getElementById('marker2'),
    marker3: document.getElementById('marker3'),
    marker4: document.getElementById('marker4'),
    marker5: document.getElementById('marker5')
};

// Create Starry Background
function createStarryBackground() {
    const background = document.getElementById('magicBackground');
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 4 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 5 + 3;
        const delay = Math.random() * 5;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.animationDelay = `${delay}s`;
        star.style.opacity = Math.random() * 0.5 + 0.2;
        
        background.appendChild(star);
    }
}

// Initialize the journey with loading sequence
document.addEventListener('DOMContentLoaded', function() {
    createStarryBackground();
    startLoadingSequence();
    
    // Check for large text mode
    if (window.innerWidth <= 600 || window.innerHeight <= 600) {
        document.body.classList.add('large-text-mode');
    }
    
    // Add event listeners to navigation buttons
    Object.keys(navButtons).forEach(btnId => {
        if (navButtons[btnId]) {
            if (btnId.startsWith('prevBtn')) {
                navButtons[btnId].addEventListener('click', previousSurprise);
            } else if (btnId.startsWith('nextBtn')) {
                navButtons[btnId].addEventListener('click', unlockNextSurprise);
            }
        }
    });
    
    // Add event listeners to progress markers
    Object.keys(markers).forEach(markerId => {
        if (markers[markerId]) {
            markers[markerId].addEventListener('click', function() {
                const step = parseInt(this.dataset.step);
                goToSurprise(step);
            });
        }
    });
    
    // Add event listeners to celebration buttons
    if (continueBtn) {
        continueBtn.addEventListener('click', closeCelebration);
    }
    
    if (secretMessageBtn) {
        secretMessageBtn.addEventListener('click', showSecretMessage);
    }
    
    // Initialize next button for surprise 5
    if (navButtons.nextBtn5) {
        navButtons.nextBtn5.addEventListener('click', completeJourney);
    }
});

// Loading Sequence with Countdown
function startLoadingSequence() {
    let countdown = 5;
    let progress = 0;
    const messages = [
        "Preparing magical surprises...",
        "Gathering birthday wishes...",
        "Setting up celebrations...",
        "Almost ready...",
        "Let the magic begin! ✨"
    ];
    let messageIndex = 0;
    
    loadingCountdown.textContent = countdown;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        loadingCountdown.textContent = countdown;
        progress += 20;
        loadingProgressBar.style.width = `${progress}%`;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            completeLoading();
        }
    }, 1000);
    
    // Update loading messages
    const messageInterval = setInterval(() => {
        if (messageIndex < messages.length) {
            loadingMessage.textContent = messages[messageIndex];
            messageIndex++;
        } else {
            clearInterval(messageInterval);
        }
    }, 1000);
}

function completeLoading() {
    // Final loading animation
    loadingProgressBar.style.width = '100%';
    loadingMessage.textContent = "Welcome to your birthday journey! 🎉";
    
    // Create celebration animation
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createAnimation('confetti', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: window.innerHeight})});
            createAnimation('sparkle', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight})});
        }, i * 100);
    }
    
    // Hide loading screen and show main content
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        masterContainer.classList.add('active');
        initSurprise1();
        
        // Initial celebration
        setTimeout(() => {
            createBurstAnimation();
            showCelebration("Welcome to your magical birthday journey! 🎂");
        }, 500);
    }, 2000);
}

// Initialize Progress Markers
function updateProgressMarkers() {
    for (let i = 1; i <= totalSurprises; i++) {
        const marker = markers[`marker${i}`];
        if (marker) {
            if (unlockedSurprises.includes(i)) {
                marker.classList.remove('locked');
                marker.classList.add('active');
                marker.innerHTML = getMarkerEmoji(i);
            } else {
                marker.classList.add('locked');
                marker.classList.remove('active');
                marker.innerHTML = '<i class="fas fa-lock"></i>';
            }
        }
    }
    
    // Update progress fill
    const progress = ((currentSurprise - 1) / (totalSurprises - 1)) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function getMarkerEmoji(step) {
    const emojis = ['🎁', '✨', '🎂', '🎈', '⭐'];
    return emojis[step - 1] || '🎉';
}

// Unlock Next Surprise Function
function unlockNextSurprise() {
    if (currentSurprise < totalSurprises) {
        const nextSurprise = currentSurprise + 1;
        
        // Check if next surprise is unlocked
        if (!unlockedSurprises.includes(nextSurprise)) {
            showUnlockAnimation(nextSurprise);
            unlockedSurprises.push(nextSurprise);
            
            // Hide current and show next after animation
            setTimeout(() => {
                switchSurprise(nextSurprise);
                updateProgressMarkers();
            }, 2000);
        } else {
            switchSurprise(nextSurprise);
        }
    }
}

function showUnlockAnimation(surpriseNumber) {
    const surpriseNames = [
        "", // Index 0
        "Word Collection",
        "Memory Puzzle", 
        "Memory of Wishes",
        "Secret Message",
        "Final Celebration"
    ];
    
    const surpriseDescriptions = [
        "",
        "Collect beautiful words that describe you",
        "Solve the magical memory puzzle",
        "Match birthday wishes and dreams",
        "Discover a hidden secret message",
        "The grand finale celebration"
    ];
    
    unlockText.textContent = `${surpriseNames[surpriseNumber]} Unlocked!`;
    unlockDescription.textContent = surpriseDescriptions[surpriseNumber];
    
    // Set different unlock icon based on surprise
    const unlockIcon = document.querySelector('.unlock-icon');
    const icons = ['', '🔤', '🧩', '🎴', '💌', '🎊'];
    unlockIcon.textContent = icons[surpriseNumber];
    
    // Show unlock animation
    unlockAnimation.classList.add('active');
    
    // Create celebration
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createAnimation('confetti', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight})});
            createAnimation('sparkle', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight})});
            if (i % 10 === 0) createAnimation('star', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight})});
        }, i * 50);
    }
    
    // Hide unlock animation after delay
    setTimeout(() => {
        unlockAnimation.classList.remove('active');
    }, 2500);
}

// Switch between surprises
function switchSurprise(surpriseNumber) {
    if (unlockedSurprises.includes(surpriseNumber)) {
        // Hide current surprise
        document.getElementById(`surprise${currentSurprise}`).classList.remove('active');
        
        // Update current surprise
        currentSurprise = surpriseNumber;
        
        // Initialize new surprise if needed
        if (currentSurprise === 2 && puzzleSolved === 0) {
            initSurprise2();
        } else if (currentSurprise === 3 && memoryPairs === 0) {
            initSurprise3();
        }
        
        // Show new surprise
        setTimeout(() => {
            document.getElementById(`surprise${currentSurprise}`).classList.add('active');
            createBurstAnimation();
        }, 300);
        
        updateProgressMarkers();
    }
}

function goToSurprise(surpriseNumber) {
    if (unlockedSurprises.includes(surpriseNumber)) {
        switchSurprise(surpriseNumber);
    }
}

function previousSurprise() {
    if (currentSurprise > 1) {
        switchSurprise(currentSurprise - 1);
    }
}

// Enhanced Surprise 1: Word Collection
function initSurprise1() {
    const wordContainer = document.getElementById('wordCollection');
    wordContainer.innerHTML = '';
    
    const shuffledWords = [...specialWords].sort(() => Math.random() - 0.5);
    
    shuffledWords.forEach((word, index) => {
        setTimeout(() => {
            const wordEl = document.createElement('div');
            wordEl.className = 'word-piece';
            wordEl.textContent = word;
            wordEl.dataset.word = word;
            
            // Staggered appearance
            setTimeout(() => {
                wordEl.style.opacity = '1';
                wordEl.style.transform = 'translateY(0)';
            }, index * 150);
            
            // Click event
            wordEl.addEventListener('click', function() {
                if (!this.classList.contains('collected')) {
                    this.classList.add('collected');
                    collectedWords++;
                    
                    // Update progress
                    const progressElement = document.getElementById('wordProgress');
                    progressElement.textContent = `📊 Collected: ${collectedWords}/${totalWords} words`;
                    progressElement.style.animation = 'none';
                    setTimeout(() => {
                        progressElement.style.animation = 'progressPulse 0.5s';
                    }, 10);
                    
                    // Celebration
                    createAnimation('heart', this);
                    createAnimation('star', this);
                    createAnimation('sparkle', this);
                    
                    // Complete check
                    if (collectedWords === totalWords) {
                        setTimeout(() => {
                            showCelebration("🎉 You've collected all the magical words! ✨");
                        }, 500);
                    }
                }
            });
            
            wordContainer.appendChild(wordEl);
        }, index * 300);
    });
}

// Enhanced Surprise 2: Puzzle
function initSurprise2() {
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.innerHTML = '';
    puzzleSolved = 0;
    
    for (let i = 0; i < totalPuzzlePieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        
        // Position and rotation
        const maxX = puzzleContainer.clientWidth - 110;
        const maxY = puzzleContainer.clientHeight - 110;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        const rotation = Math.random() * 60 - 30;
        
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
        piece.style.transform = `rotate(${rotation}deg) scale(0)`;
        
        // Animate entrance
        setTimeout(() => {
            piece.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            piece.style.transform = `rotate(${rotation}deg) scale(1)`;
        }, i * 100);
        
        // Puzzle image
        const row = Math.floor(i / 4);
        const col = i % 4;
        const bgX = -col * 100;
        const bgY = -row * 100;
        
        // Use a working image URL
        piece.style.backgroundImage = `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')`;
        piece.style.backgroundPosition = `${bgX}px ${bgY}px`;
        piece.style.backgroundSize = '400% 400%';
        
        // Click event
        piece.addEventListener('click', function() {
            if (!this.classList.contains('solved')) {
                this.classList.add('solved');
                puzzleSolved++;
                
                // Update progress
                const progressElement = document.getElementById('puzzleProgress');
                progressElement.textContent = `📊 Solved: ${puzzleSolved}/${totalPuzzlePieces} pieces`;
                progressElement.style.animation = 'none';
                setTimeout(() => {
                    progressElement.style.animation = 'progressPulse 0.5s';
                }, 10);
                
                // Celebration
                createAnimation('star', this);
                createAnimation('sparkle', this);
                
                // Complete check
                if (puzzleSolved === totalPuzzlePieces) {
                    setTimeout(() => {
                        showCelebration("🧩 You've solved the magical puzzle! 🎉");
                    }, 500);
                }
            }
        });
        
        puzzleContainer.appendChild(piece);
    }
}

// Enhanced Surprise 3: Memory Game
function initSurprise3() {
    const memoryGrid = document.getElementById('memoryGrid');
    memoryGrid.innerHTML = '';
    memoryPairs = 0;
    flippedCards = [];
    canFlip = true;
    
    const symbols = ['🎂', '🎁', '🎈', '✨', '🎉', '⭐', '🌸', '💫', '🦋', '🌠', '🕯️', '🍰'];
    const selectedSymbols = symbols.slice(0, totalMemoryPairs);
    const cardValues = [...selectedSymbols, ...selectedSymbols];
    
    shuffleArray(cardValues);
    
    cardValues.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        // Animate entrance
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 100);
        
        // Click event
        card.addEventListener('click', function() {
            if (!canFlip || this.classList.contains('matched') || this.classList.contains('revealed')) {
                return;
            }
            
            this.classList.add('revealed');
            this.textContent = this.dataset.symbol;
            flippedCards.push(this);
            
            if (flippedCards.length === 2) {
                canFlip = false;
                
                setTimeout(() => {
                    const card1 = flippedCards[0];
                    const card2 = flippedCards[1];
                    
                    if (card1.dataset.symbol === card2.dataset.symbol) {
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        card1.classList.remove('revealed');
                        card2.classList.remove('revealed');
                        
                        memoryPairs++;
                        
                        // Update progress
                        const progressElement = document.getElementById('memoryProgress');
                        progressElement.textContent = `📊 Found: ${memoryPairs}/${totalMemoryPairs} pairs`;
                        progressElement.style.animation = 'none';
                        setTimeout(() => {
                            progressElement.style.animation = 'progressPulse 0.5s';
                        }, 10);
                        
                        // Celebration
                        createAnimation('heart', card1);
                        createAnimation('confetti', card1);
                        createAnimation('sparkle', card1);
                        
                        // Complete check
                        if (memoryPairs === totalMemoryPairs) {
                            setTimeout(() => {
                                showCelebration("🎉 You've found all the matching pairs! 🎊");
                            }, 500);
                        }
                    } else {
                        card1.classList.remove('revealed');
                        card2.classList.remove('revealed');
                        card1.textContent = '';
                        card2.textContent = '';
                    }
                    
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        });
        
        memoryGrid.appendChild(card);
    });
}

// Complete Journey
function completeJourney() {
    // Massive final celebration
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            createAnimation('heart', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: window.innerHeight})});
            createAnimation('balloon', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: window.innerHeight})});
            createAnimation('confetti', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight})});
            createAnimation('sparkle', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight})});
            if (i % 10 === 0) createAnimation('cake', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: window.innerHeight})});
        }, i * 30);
    }
    
    showCelebration("🎊 Congratulations! You've completed the entire magical birthday journey! 🎂✨");
    
    // Final secret
    setTimeout(() => {
        celebrationText.innerHTML = "🎁 One Last Secret... 🎁<br><br>The greatest gift isn't in the puzzles or games, but in the joy of celebrating you. Happy Birthday, Piyumi!";
    }, 3000);
}

// Enhanced Celebration Functions
function showCelebration(message) {
    celebrationText.innerHTML = message;
    celebrationMessage.classList.add('active');
}

function closeCelebration() {
    celebrationMessage.classList.remove('active');
}

function showSecretMessage() {
    celebrationText.innerHTML = "💝 Special Birthday Wish 💝<br><br>May your special day be filled with as much happiness as you bring to others. You deserve all the wonderful things life has to offer!";
    celebrationMessage.classList.add('active');
}

// Enhanced Animation Creation
function createAnimation(type, element) {
    const rect = element.getBoundingClientRect();
    const anim = document.createElement('div');
    anim.className = 'floating-element';
    
    const colors = ['#ff85a2', '#b478c8', '#7ec8e3', '#9ddfbb', '#ffb347', '#ff6b6b', '#a29bfe'];
    
    if (type === 'heart') {
        anim.classList.add('heart-anim');
        anim.innerHTML = ['❤️', '💖', '💗', '💓', '💞'][Math.floor(Math.random() * 5)];
        anim.style.left = `${rect.left + rect.width/2}px`;
        anim.style.top = `${rect.top}px`;
        anim.style.fontSize = `${1.8 + Math.random() * 2}rem`;
        anim.style.color = colors[Math.floor(Math.random() * colors.length)];
        anim.style.animationDuration = `${4 + Math.random() * 4}s`;
    } 
    else if (type === 'balloon') {
        anim.classList.add('balloon-anim');
        anim.style.left = `${rect.left}px`;
        anim.style.top = `${rect.top}px`;
        anim.style.color = colors[Math.floor(Math.random() * colors.length)];
        anim.style.animationDuration = `${7 + Math.random() * 5}s`;
    }
    else if (type === 'star') {
        anim.classList.add('star-anim');
        anim.style.left = `${rect.left + Math.random() * rect.width}px`;
        anim.style.top = `${rect.top + Math.random() * rect.height}px`;
        anim.style.backgroundColor = ['#ffd700', '#ffed4e', '#fff9aa', '#ffeaa7'][Math.floor(Math.random() * 4)];
    }
    else if (type === 'cake') {
        anim.classList.add('cake-anim');
        anim.innerHTML = '🎂';
        anim.style.left = `${rect.left}px`;
        anim.style.top = `${rect.top}px`;
        anim.style.animationDuration = `${6 + Math.random() * 4}s`;
    }
    else if (type === 'confetti') {
        anim.classList.add('confetti-piece');
        anim.style.left = `${rect.left}px`;
        anim.style.top = `${rect.top}px`;
        anim.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        anim.style.width = `${10 + Math.random() * 15}px`;
        anim.style.height = `${10 + Math.random() * 15}px`;
        anim.style.borderRadius = Math.random() > 0.5 ? '50%' : '4px';
        anim.style.transform = `rotate(${Math.random() * 360}deg)`;
        anim.style.animationDuration = `${3 + Math.random() * 3}s`;
    }
    else if (type === 'sparkle') {
        anim.classList.add('sparkle-anim');
        anim.style.left = `${rect.left + Math.random() * rect.width}px`;
        anim.style.top = `${rect.top + Math.random() * rect.height}px`;
        anim.style.animationDelay = `${Math.random() * 0.5}s`;
    }
    
    document.getElementById('celebrationArea').appendChild(anim);
    
    // Remove after animation
    setTimeout(() => {
        if (anim.parentNode) {
            anim.remove();
        }
    }, 8000);
}

function createBurstAnimation() {
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            createAnimation('confetti', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight})});
            createAnimation('sparkle', {getBoundingClientRect: () => ({left: Math.random() * window.innerWidth, top: Math.random() * window.innerHeight})});
        }, i * 50);
    }
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize progress markers
updateProgressMarkers();