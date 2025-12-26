// Timer variables
let timer;
let seconds = 0;

// DOM elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

// Start Timer
startBtn.addEventListener('click', () => {
    if (!timer) {
        timer = setInterval(() => {
            seconds++;
            let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
            let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            let secs = String(seconds % 60).padStart(2, '0');
            timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }
});

// Stop Timer
stopBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
});

// Reset Timer
resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    seconds = 0;
    timerDisplay.textContent = "00:00:00";
});

// Leak Detection
const detectBtn = document.getElementById('detect-btn');
const leakStatus = document.getElementById('leak-status');

detectBtn.addEventListener('click', () => {
    // Dummy detection: 50% chance
    const leakDetected = Math.random() > 0.5;
    leakStatus.textContent = leakDetected ? "Leak detected!" : "No leak detected";
});