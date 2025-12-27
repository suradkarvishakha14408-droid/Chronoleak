// -------------------- VARIABLES --------------------
let seconds = 0;
let timerInterval;
let leakInterval;

let leakTrend = [];
let appUsage = { Social: 0, Study: 0, Entertainment: 0, Others: 0 };
let leaksDetected = 0;
let focusMode = false;

let leakChart, pieChart;

// -------------------- TIMER --------------------
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
    // Optionally stop leak detection if you want leaks only while timer runs
    // clearInterval(leakInterval);
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById("timer").innerText = "00:00";
}

function updateTimerUI() {
    let min = Math.floor(seconds/60);
    let sec = seconds%60;
    document.getElementById("timer").innerText =
        `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

// -------------------- FOCUS MODE --------------------
function toggleFocus() {
    focusMode = !focusMode;
    const body = document.body;
    const btn = document.getElementById("focusBtn");

    if (focusMode) {
        body.classList.add("focus-mode");
        btn.innerText = "Disable Focus Mode";
        alert("Focus Mode Enabled 😎 Stay focused!");
    } else {
        body.classList.remove("focus-mode");
        btn.innerText = "Enable Focus Mode";
        alert("Focus Mode Disabled 🎉");
    }
}

// Prevent clicks on analytics while focus mode is ON
document.querySelector(".analytics").addEventListener("click", e => {
    if(focusMode){
        e.preventDefault();
        e.target.style.transform = "translateX(5px)";
        setTimeout(()=>{e.target.style.transform="";}, 100);
        alert("Focus Mode is ON! 😅");
    }
});

// -------------------- LEAK DETECTION --------------------
function startLeakDetection() {
    clearInterval(leakInterval);
    leakInterval = setInterval(() => {
        let leakHappened = Math.random() < 0.35; // 35% chance

        if(leakHappened){
            leaksDetected++;
            document.getElementById("leakStatus").innerText = "⚠️ Leak detected!";
            document.getElementById("leakStatus").style.color = "#ff5757";

            // Update usage randomly
            appUsage.Social += Math.floor(Math.random()*2);
            appUsage.Study += Math.floor(Math.random()*2)+1;
        }

        leakTrend.push(leaksDetected);
        updateCharts();
        updateWeeklyReport();
        updateAIInsights();
    }, 8000); // ~8 seconds
}

// -------------------- CHARTS --------------------
function loadCharts() {
    const ctx = document.getElementById("leakChart");
    leakChart = new Chart(ctx, {
        type: "line",
        data: { labels: leakTrend.map((_,i)=>i), datasets:[{
            label:"Leaks Detected",
            data: leakTrend,
            borderColor:"#4da3ff",
            borderWidth:2
        }]},
        options:{ responsive:true, maintainAspectRatio:false }
    });

    const pctx = document.getElementById("pieChart");
    pieChart = new Chart(pctx, {
        type: "pie",
        data: { labels: Object.keys(appUsage), datasets:[{
            data: Object.values(appUsage),
            backgroundColor:["#4da3ff","#ff5757","#ffc857","#6cf57a"]
        }]},
        options:{ responsive:true, maintainAspectRatio:false }
    });
}

function updateCharts() {
    leakChart.data.labels = leakTrend.map((_,i)=>i);
    leakChart.data.datasets[0].data = leakTrend;
    leakChart.update();

    pieChart.data.datasets[0].data = Object.values(appUsage);
    pieChart.update();
}

// -------------------- WEEKLY REPORT --------------------
function updateWeeklyReport() {
    let totalLeaks = leaksDetected;
    let totalMinutes = Math.floor(seconds/60);
    let productivityScore = Math.max(0, 100 - totalLeaks*5 + Math.floor(totalMinutes/2));
    if(productivityScore>100) productivityScore=100;

    let focusBarLength = Math.floor(productivityScore/10);
    let focusBar = "🟩".repeat(focusBarLength)+"⬜".repeat(10-focusBarLength);

    let message = "";
    if(productivityScore>=90) message="Legendary focus! 🦸‍♀️ Keep crushing it!";
    else if(productivityScore>=70) message="Great job! 💪 Keep the momentum!";
    else if(productivityScore>=40) message="Moderate focus ⚡ You can do better!";
    else message="Uh-oh! 😱 Too many leaks! Focus time!";

    document.getElementById("weeklyReport").innerHTML = `
        ⚡ <b>Weekly Focus Report</b> ⚡<br>
        💥 Total leaks: ${totalLeaks}<br>
        ⏳ Focused minutes: ${totalMinutes}<br>
        🌟 Productivity Score: ${productivityScore}/100<br>
        ${focusBar}<br>
        <i>${message}</i>
    `;
}

// -------------------- AI INSIGHTS --------------------
function updateAIInsights() {
    if(leaksDetected<3) document.getElementById("aiInsights").innerText="Great discipline! Minimal leaks 😎";
    else if(leaksDetected<7) document.getElementById("aiInsights").innerText="Moderate leaks. Try short breaks!";
    else document.getElementById("aiInsights").innerText="Too many leaks. Reduce distractions! 🚨";
}

// -------------------- INITIALIZE --------------------
window.onload = loadCharts;