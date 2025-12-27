let seconds = 0;
let timerInterval;
let leakInterval;

let leakTrend = [];
let leakChart;
let pieChart;

let appUsage = {
    Social: 0,
    Study: 0,
    Entertainment: 0,
    Others: 0
};

let leaksDetected = 0;

// TIMER
function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        seconds++;
        updateTimerUI();
    }, 1000);

    startLeakDetection();
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById("timer").innerText = "00:00";
}

function updateTimerUI() {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    document.getElementById("timer").innerText =
        `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

// LEAK DETECTION
function startLeakDetection() {
    clearInterval(leakInterval);

    leakInterval = setInterval(() => {
        let leakHappened = Math.random() < 0.35;

        if (leakHappened) {
            leaksDetected++;
            leakTrend.push(leaksDetected);
            document.getElementById("leakStatus").innerText =
                "⚠️ Leak detected! Stay focused!";
            document.getElementById("leakStatus").style.color = "#ff5757";

            updateCharts();
            updateWeeklyReport();
            updateAIInsights();
        } else {
            leakTrend.push(leaksDetected);
        }

    }, 8000);
}

// CHARTS
function loadCharts() {
    const ctx = document.getElementById("leakChart");
    leakChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: leakTrend.map((_,i)=>i),
            datasets: [{
                label: "Leaks Detected",
                data: leakTrend,
                borderColor: "#4da3ff",
                borderWidth: 2
            }]
        }
    });

    const pctx = document.getElementById("pieChart");
    pieChart = new Chart(pctx, {
        type: "pie",
        data: {
            labels: Object.keys(appUsage),
            datasets: [{
                data: Object.values(appUsage),
                backgroundColor: ["#4da3ff","#ff5757","#ffc857","#6cf57a"]
            }]
        }
    });
}

function updateCharts() {
    appUsage.Social += Math.floor(Math.random()*2);
    appUsage.Study += Math.floor(Math.random()*2)+1;

    leakChart.data.labels = leakTrend.map((_,i)=>i);
    leakChart.data.datasets[0].data = leakTrend;
    leakChart.update();

    pieChart.data.datasets[0].data = Object.values(appUsage);
    pieChart.update();
}

// WEEKLY REPORT
function updateWeeklyReport() {
    document.getElementById("weeklyReport").innerText =
        `This week you had ${leaksDetected} distractions.
         Focus improving slowly. Keep going!`;
}

// AI Insights
function updateAIInsights() {
    if (leaksDetected < 3)
        document.getElementById("aiInsights").innerText =
            "Great discipline! Minimal leaks 😎";
    else if (leaksDetected < 7)
        document.getElementById("aiInsights").innerText =
            "Moderate leaks. Try short breaks!";
    else
        document.getElementById("aiInsights").innerText =
            "Too many leaks. Reduce phone distractions!";
}

// INITIALIZE
window.onload = loadCharts;
  
