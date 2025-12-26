// ---------------- Timer ----------------
let timer;
let seconds = 0;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

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

stopBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    seconds = 0;
    timerDisplay.textContent = "00:00:00";
});

// ---------------- Leak Detection + Chart ----------------
let leakData = [];
let timeLabels = [];

const detectBtn = document.getElementById('detect-btn');
const leakStatus = document.getElementById('leak-status');
const leakLog = document.getElementById('leak-log');

const ctx = document.getElementById('leak-chart').getContext('2d');

const leakChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Leak Level',
            data: leakData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});

detectBtn.addEventListener('click', () => {
    const leakLevel = Math.floor(Math.random() * 101);
    let statusText = "";

    if (leakLevel < 20) statusText = "No leak detected";
    else if (leakLevel < 50) statusText = "Minor leak detected";
    else if (leakLevel < 80) statusText = "Moderate leak detected!";
    else statusText = "Severe leak detected!!!";

    leakStatus.textContent = statusText;

    // Log entry
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    const logItem = document.createElement('li');
    logItem.textContent = `[${timestamp}] Leak Level: ${leakLevel} → ${statusText}`;
    leakLog.prepend(logItem);

    // Update chart
    leakData.push(leakLevel);
    timeLabels.push(timestamp);
    leakChart.update();
});