(function () {
  const STORAGE_FILE = "sleeptracker.data.json";
  const SETTINGS_FILE = "sleeptracker.settings.json";
  const LOG_INTERVAL_MS = 60000;
  const CHUNK_SIZE = 100;
  const EOT = "\x04";
  
  let logInterval, dataBuffer = [], isLogging = false;
  let lastHR = 0, lastMovement = { x: 0, y: 0, z: 0 }, currentMovement = 0;

  // Advertise UART so your web app can find us
  NRF.setServices(undefined, { uart: true });

  // Sensor handlers
  Bangle.on('HRM', hrm => { if (hrm.confidence > 80) lastHR = hrm.bpm; });
  Bangle.on('accel', acc => {
    let d = Math.abs(acc.x - lastMovement.x)
          + Math.abs(acc.y - lastMovement.y)
          + Math.abs(acc.z - lastMovement.z);
    currentMovement += d;
    lastMovement = acc;
  });

  function logData() {
    if (lastHR > 0) {
      dataBuffer.push({
        time: new Date().toISOString(),
        hr: lastHR,
        movement: parseFloat(currentMovement.toFixed(2))
      });
      lastHR = 0;
      currentMovement = 0;
      if (dataBuffer.length >= 10) {
        try {
          let existing = require("Storage").readJSON(STORAGE_FILE, true) || [];
          require("Storage").writeJSON(STORAGE_FILE, existing.concat(dataBuffer));
          dataBuffer = [];
        } catch (e) {
          // ignore storage write errors
          dataBuffer = [];
        }
      }
    }
  }

  function startLogging() {
    Bangle.setHRMPower(1);
    lastMovement = Bangle.getAccel();
    logInterval = setInterval(logData, LOG_INTERVAL_MS);
    isLogging = true;
  }
  function stopLogging() {
    clearInterval(logInterval);
    try {
      if (dataBuffer.length) {
        let existing = require("Storage").readJSON(STORAGE_FILE, true) || [];
        require("Storage").writeJSON(STORAGE_FILE, existing.concat(dataBuffer));
      }
    } catch (e) {}
    dataBuffer = [];
    Bangle.setHRMPower(0);
    isLogging = false;
  }
  function checkState() {
    try {
      let s = require("Storage").readJSON(SETTINGS_FILE, true) || {};
      if (s.isLogging && !isLogging) startLogging();
      else if (!s.isLogging && isLogging) stopLogging();
    } catch (e) {}
  }
  setInterval(checkState, 300000);
  checkState();


let receiveBuffer = "";

function sendSleepData() {
  const EOT = '\x04';
  let file = require("Storage").read("sleep.json");
  if (file) {
    let pos = 0;
    let chunkSize = 100; // Send 100 characters at a time
    
    function sendChunk() {
      if (pos >= file.length) {
        Bluetooth.write(EOT); // Send end-of-transmission
        return;
      }
      let chunk = file.substr(pos, chunkSize);
      pos += chunkSize;
      Bluetooth.write(chunk)
        .then(sendChunk)
        .catch(err => console.log("Send error:", err));
    }
    
    sendChunk(); // Start sending
  } else {
    Bluetooth.write('ERROR: No sleep data found' + EOT);
  }
}

NRF.on('data', function(data) {
  receiveBuffer += data;
  let newlineIndex = receiveBuffer.indexOf('\n');
  
  if (newlineIndex >= 0) {
    let command = receiveBuffer.substring(0, newlineIndex).trim();
    receiveBuffer = receiveBuffer.substring(newlineIndex + 1);
    
    if (command === "loadsleep") {
      setTimeout(sendSleepData, 50); // Small delay to prevent Bluetooth stack issues
    }
  }
});

})();
