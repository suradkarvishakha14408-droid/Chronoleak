const detectBtn = document.getElementById('detect-btn');
const leakStatus = document.getElementById('leak-status');
const leakLog = document.getElementById('leak-log');

detectBtn.addEventListener('click', () => {
    // Simulate realistic sensor data
    // Example: leak level from 0 to 100
    const leakLevel = Math.floor(Math.random() * 101); // 0 to 100

    let statusText = "";
    if (leakLevel < 20) {
        statusText = "No leak detected";
    } else if (leakLevel < 50) {
        statusText = "Minor leak detected";
    } else if (leakLevel < 80) {
        statusText = "Moderate leak detected!";
    } else {
        statusText = "Severe leak detected!!!";
    }

    leakStatus.textContent = statusText;

    // Add log entry with timestamp
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    const logItem = document.createElement('li');
    logItem.textContent = `[${timestamp}] Leak Level: ${leakLevel} → ${statusText}`;
    leakLog.prepend(logItem); // add to top
});