let seconds = 0;
let timerRunning = false;
let timerInterval;

let focusedMinutes = 0;
let leaks = 0;
let score = 100;
let coins = 0;
let achievements = [];

const leakSound = document.getElementById("leakSound");
const successSound = document.getElementById("successSound");
const focusSound = document.getElementById("focusSound");

// ---------------- TIMER ---------------- //
function startTimer(){
  if(timerRunning) return;
  timerRunning = true;

  timerInterval = setInterval(()=>{
    seconds++;
    displayTime();
    updateRing();

    if(seconds % 60 === 0){
      focusedMinutes++;
      document.getElementById("focusedMinutes").textContent = focusedMinutes;
      updateWeeklyReport();
      updatePie();
      updateLine();
      earnCoin(1);
    }
  },1000);
}

function stopTimer(){ timerRunning=false; clearInterval(timerInterval); }
function resetTimer(){ stopTimer(); seconds=0; displayTime(); updateRing(); }

function displayTime(){
  let min=Math.floor(seconds/60);
  let sec=seconds%60;
  document.getElementById("timerDisplay").textContent=
    `${min.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
}

function updateRing(){
  const ring = document.getElementById("timerRing");
  let dash = 314 - (314 * (seconds%60))/60;
  ring.style.strokeDashoffset=dash;
}

// ---------------- LEAK DETECTION ---------------- //
setInterval(()=>{
  if(Math.random() < 0.25){
    leaks++;
    leakSound.play();
    document.getElementById("leakCount").textContent = leaks;
    score = Math.max(0, score-3);
    document.getElementById("score").textContent = score;
    updateLine();
    updatePie();
    updateWeeklyReport();
  }
},12000);

// ---------------- CHARTS ---------------- //
let ctx = document.getElementById("leakChart").getContext("2d");
let gradient = ctx.createLinearGradient(0,0,0,400);
gradient.addColorStop(0,"rgba(45,109,223,0.5)");
gradient.addColorStop(1,"rgba(45,109,223,0.05)");

let leakChart = new Chart(ctx,{
 type:"line",
 data:{ labels:[], datasets:[{
    label:"Leak Trend",
    data:[],
    borderColor:"#4caf50",
    borderWidth:3,
    backgroundColor: gradient,
    tension:0.4,
    fill:true
 }]},
 options:{ responsive:true }
});

let pieChart = new Chart(document.getElementById("pieChart"),{
 type:"pie",
 data:{ labels:["Study","Social","Distractions","Games"], datasets:[{ data:[1,1,1,1], backgroundColor:["#4caf50","#2196f3","#f44336","#ff9800"] }] },
 options:{ responsive:true, plugins:{legend:{position:"bottom"}} }
});

function updateLine(){
  leakChart.data.labels.push(leakChart.data.labels.length+1);
  leakChart.data.datasets[0].data.push(leaks);
  leakChart.update();
}

function updatePie(){
  let study = focusedMinutes;
  let social = Math.floor(leaks/2);
  let distractions = Math.floor(leaks/2);
  let games = Math.max(0, leaks - social - distractions);
  pieChart.data.datasets[0].data=[study,social,distractions,games];
  pieChart.update();
}

// ---------------- WEEKLY REPORT ---------------- //
function updateWeeklyReport(){
  const reportEl = document.getElementById("weeklyReport");
  reportEl.innerHTML = "";

  // Focused Minutes
  const focusedLine = document.createElement("span");
  focusedLine.classList.add("green");
  focusedLine.textContent = `📌 Focused Minutes: ${focusedMinutes}`;
  reportEl.appendChild(focusedLine);

  // Leaks Detected
  const leaksLine = document.createElement("span");
  leaksLine.classList.add(leaks>5 ? "red" : "yellow");
  leaksLine.textContent = `⚠️ Leaks Detected: ${leaks}`;
  reportEl.appendChild(leaksLine);

  // Productivity Score
  const scoreLine = document.createElement("span");
  if(score>=80) scoreLine.classList.add("green");
  else if(score>=50) scoreLine.classList.add("yellow");
  else scoreLine.classList.add("red");
  scoreLine.textContent = `🏆 Productivity Score: ${score}/100`;
  reportEl.appendChild(scoreLine);

  // Motivational Line
  const motivLine = document.createElement("span");
  if(score>=80) motivLine.classList.add("green");
  else if(score>=50) motivLine.classList.add("yellow");
  else motivLine.classList.add("red");

  if(score>=80) motivLine.textContent = "🔥 Outstanding focus warrior! Keep going!";
  else if(score>=50) motivLine.textContent = "💪 Good job! But leaks are sneaking in… stay alert!";
  else motivLine.textContent = "😔 Too many leaks… rebuild discipline. You CAN do this!";
  reportEl.appendChild(motivLine);
}

// ---------------- FOCUS MODE ---------------- //
const overlay=document.getElementById("focusOverlay");
document.getElementById("focusModeBtn").addEventListener("click", ()=>{
  overlay.style.display="flex";
  focusSound.play();
});
document.getElementById("exitFocusBtn").addEventListener("click", ()=>{
  overlay.style.display="none";
  successSound.play();
});

// ---------------- COINS & ACHIEVEMENTS ---------------- //
function earnCoin(amount=1){
  coins+=amount;
  document.getElementById("coins").textContent=coins;

  for(let i=0;i<amount;i++){
    createCoinAnimation();
  }
}

function unlockAchievement(name){
  if(!achievements.includes(name)){
    achievements.push(name);
    document.getElementById("achievements").textContent=achievements.join(", ");
    successSound.play();

    for(let i=0;i<15;i++){
      createConfetti();
    }
  }
}

// ---------------- COIN & CONFETTI ANIMATIONS ---------------- //
function createCoinAnimation(){
  const coin = document.createElement("div");
  coin.classList.add("coin");
  coin.style.left = Math.random() * 80 + 10 + "%";
  coin.style.top = "80%";
  document.getElementById("coinContainer").appendChild(coin);
  setTimeout(()=> coin.remove(),1000);
}

function createConfetti(){
  const confetti = document.createElement("div");
  confetti.classList.add("confetti");
  confetti.style.left = Math.random()*90 + "%";
  confetti.style.top = "0%";
  const colors = ["#FFD700","#FF4500","#00FFFF","#FF69B4","#ADFF2F"];
  confetti.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
  document.getElementById("confettiContainer").appendChild(confetti);
  setTimeout(()=> confetti.remove(), 2000);
}

// AUTO ACHIEVEMENTS FOR DEMO
setInterval(()=>{
  if(focusedMinutes>0 && focusedMinutes%5===0){
    unlockAchievement(`Focused ${focusedMinutes} mins`);
  }
},10000);