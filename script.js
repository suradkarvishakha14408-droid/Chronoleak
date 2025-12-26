let seconds = 0;
let timerInterval = null;
let leakInterval = null;
let leakHistory = [];
let focusEnabled = false;

// ================= TIMER ==================
function startTimer(){
  if(timerInterval) return;

  timerInterval = setInterval(()=>{
    seconds++;
    displayTime();
  },1000);

  // Start automatic leak detection randomly between 30-60s
  if(!leakInterval){
    leakInterval = setInterval(()=>{
      if(!focusEnabled && timerInterval){
        simulateLeak();
        updateWeeklyReport();
        generateInsights();
        calculateScore();
      }
    }, Math.floor(Math.random()*30000)+30000); // 30-60 sec
  }
}

function stopTimer(){
  clearInterval(timerInterval);
  timerInterval = null;

  clearInterval(leakInterval);
  leakInterval = null;

  if(seconds>0 && !focusEnabled){
    let mins = Math.round(seconds/60);
    addLeak(mins);
    updateCharts();
    updateWeeklyReport();
    generateInsights();
    calculateScore();
    sendNotification("Leak Recorded","You wasted "+mins+" mins 😅");
  }
}

function resetTimer(){
  seconds = 0;
  displayTime();
}

function displayTime(){
  let m = Math.floor(seconds/60);
  let s = seconds%60;
  document.getElementById("timer").innerText =
    (m<10?"0":"")+m + ":" + (s<10?"0":"")+s;
}

// ================= SAVE LEAK ==================
function addLeak(duration){
  const date = new Date();
  leakHistory.push({
    duration,
    hour : date.getHours(),
    day : date.getDay()
  });
}

// ================= CHARTS ==================
const lineCtx = document.getElementById("lineChart");
const pieCtx  = document.getElementById("pieChart");

let lineChart = new Chart(lineCtx,{
  type:"line",
  data:{
    labels:[],
    datasets:[{
      label:"Leak Duration (mins)",
      data:[],
      borderWidth:3,
      borderColor:"#38bdf8"
    }]
  }
});

let pieChart = new Chart(pieCtx,{
  type:"pie",
  data:{
    labels:["Focus","Productive","Mild Leak","Severe Leak"],
    datasets:[{
      data:[0,0,0,0],
      backgroundColor:["green","yellow","orange","red"]
    }]
  }
});

// ----------------- Pie Chart Update Function -----------------
function updatePieChart(severity) {
    if(severity === "focus") pieChart.data.datasets[0].data[0] += 1;
    else if(severity === "productive") pieChart.data.datasets[0].data[1] += 1;
    else if(severity === "mild") pieChart.data.datasets[0].data[2] += 1;
    else if(severity === "severe") pieChart.data.datasets[0].data[3] += 1;

    pieChart.update();
}

// ----------------- Simulate Leak Function -----------------
function simulateLeak() {
    let r = Math.random();
    if(r < 0.4){
        updatePieChart("productive");
        addLeakPoint(1);
    } else if(r < 0.7){
        updatePieChart("mild");
        addLeakPoint(3);
    } else {
        updatePieChart("severe");
        addLeakPoint(5);
    }
}

// ----------------- Line Chart Update -----------------
function addLeakPoint(value){
    lineChart.data.labels.push("Leak "+(leakHistory.length+1));
    lineChart.data.datasets[0].data.push(value);
    lineChart.update();
}

// ================= WEEKLY REPORT ==================
function updateWeeklyReport(){
  let sum = leakHistory.reduce((a,b)=>a+b.duration,0);
  document.getElementById("weeklyReport").innerText =
  "Total Time Wasted This Week: "+sum+" mins";
}

// ================= AI INSIGHTS ==================
function generateInsights(){
  const box = document.getElementById("insight-list");
  box.innerHTML = "";
  if(leakHistory.length < 3){
      box.innerHTML = "<p>Need more data to analyze...</p>";
      return;
  }
  let avg = getAverageLeak();
  let peak = getPeakLeakHour();
  let trend = getTrend();
  let insights = [
      `Average leak duration: ${avg} mins`,
      `Most leaks happen around ${peak}:00`,
      trend
  ];
  insights.forEach(text=>{
      let p=document.createElement("p");
      p.innerText=text;
      box.appendChild(p);
  });
}

function getAverageLeak(){
  let total = leakHistory.reduce((a,b)=>a+b.duration,0);
  return Math.round(total / leakHistory.length);
}

function getPeakLeakHour(){
  let hours = {};
  leakHistory.forEach(l=>{
      hours[l.hour]=(hours[l.hour] || 0)+1;
  });
  return Object.keys(hours).reduce((a,b)=> hours[a]>hours[b]?a:b);
}

function getTrend(){
  if(leakHistory.length < 5) return "Need more data for trend analysis";
  let mid = Math.floor(leakHistory.length/2);
  let first = leakHistory.slice(0,mid);
  let second = leakHistory.slice(mid);
  let avg1 = first.reduce((a,b)=>a+b.duration,0)/first.length;
  let avg2 = second.reduce((a,b)=>a+b.duration,0)/second.length;
  if(avg2 < avg1) return "Great! Your leak time is improving 👍";
  else return "Leak time increasing — Try Focus Mode 🚨";
}

// ================= PRODUCTIVITY SCORE ==================
function calculateScore(){
  if(leakHistory.length === 0){
    document.getElementById("scoreValue").innerText="--";
    document.getElementById("scoreMessage").innerText="Start working first 😆";
    return;
  }
  let totalLeak = leakHistory.reduce((a,b)=>a+b.duration,0);
  let score = 100 - Math.min(totalLeak,100);
  document.getElementById("scoreValue").innerText = score;
  if(score > 80) document.getElementById("scoreMessage").innerText="Outstanding! You're super focused 🔥";
  else if(score > 60) document.getElementById("scoreMessage").innerText="Good! Keep improving 😊";
  else if(score > 40) document.getElementById("scoreMessage").innerText="Average… You can do better 😐";
  else document.getElementById("scoreMessage").innerText="Too many leaks 😭 Fix your habits!";
}

// ================= FOCUS MODE ==================
function startFocus(){
  focusEnabled = true;
  seconds = 0;
  resetTimer();
  document.getElementById("focusStatus").innerText = "Focus Mode is ON 🔥 Stay disciplined";
  sendNotification("Focus Mode Enabled","No leaks will be recorded 😎");
}

function stopFocus(){
  focusEnabled = false;
  document.getElementById("focusStatus").innerText = "Focus Mode is OFF 😴";
  sendNotification("Focus Mode Disabled","Leak tracking resumed");
}

// ================= NOTIFICATIONS ==================
if("Notification" in window){
  Notification.requestPermission();
}

function sendNotification(title,msg){
  if(Notification.permission==="granted"){
    new Notification(title,{ body: msg });
  }
}
  
