

## 💤 Sleep Trackr: A Comprehensive Sleep Monitoring App for Bangle.js

An all-in-one **sleep tracking application** for Bangle.js 1 and 2. Sleep Trackr logs heart rate and movement during the night, classifies sleep stages (Deep, Light, REM, Awake), and syncs data via Bluetooth for detailed visualization on your phone or PC.



---

## ✨ Features

* 📊 **Heart Rate and Movement Logger**
  Logs your BPM and body movement every 1 minute while sleeping.

* 💤 **Automatic Sleep Detection**
  Starts and stops based on a `settings.json` flag (`isLogging: true`).

* 📡 **BLE Sync via UART**
  Responds to a custom Bluetooth command (`\x10loadsleep\n`) and sends `sleeptracker.data.json` over BLE in chunks.

* 📈 **Sleep Phase Classification (Optional)**
  Classifies each time point as Deep, Light, REM, or Awake based on movement + HR.

* 🖥️ **Frontend Visualization Support**
  Works with a companion [web app]((https://nap-net.vercel.app/)) or Android app for graphing and insights.

---

## 🚀 Installation

1. Make sure your Bangle.js is connected via Bluetooth.
2. Go to the [Sleep Trackr App Page](https://premshinde26.github.io/BangleApps/).
3. Find **Sleep Trackr** in the app list.
4. Click the **Upload** button.
5. Done! The app installs and runs in the background.

---

## ▶️ Usage

The app runs automatically in the background and logs data when `sleeptracker.settings.json` has:

```json
{ "isLogging": true }
```

You can toggle logging via a separate on-watch settings app or file write.

To fetch the sleep data:

1. Connect via Web Bluetooth (see `index.html` in the frontend).
2. App sends command: `\x10loadsleep\n`
3. The watch replies with `sleeptracker.data.json` in chunks, ends with `\x04`.

---

## 🧭 Controls

Sleep Trackr runs silently, but supports the following:

* **BTN1 (or settings menu)** — Stop/Start logging (optional feature)
* **BLE UART** — Fetch JSON log for analysis

---

## 🛠 Customizable Settings

You can edit the following using the [Bangle.js App Loader](https://banglejs.com/apps):

* **Logging Flag**:
  Set `isLogging: true` to begin logging on boot.
* **Logging Interval**:
  Currently fixed at 60 seconds in the script (can be changed in code).
* **Data File**:
  Logs stored in `sleeptracker.data.json`.

---

## 🧪 Companion Frontend

The app is designed to be used with:

* 📱 **Web App**:
  `index.html` supports BLE sync, JSON parsing, phase classification, and chart rendering using Chart.js.
* 📱 **Android App (optional)**:
  Native Kotlin app that connects to Bangle.js and shows visual charts.

---

## 👨‍💻 Development Setup

1. Fork this repo.
2. Edit `sleeptracker.boot.js` in [Espruino Web IDE](https://banglejs.com/apps/#ide).
3. Upload to RAM for testing; save to Flash when stable.
4. Test with your frontend or using:

   ```js
   Bluetooth.write("\x10loadsleep\n");
   ```

---

## 📁 File Structure

```
.
├── sleeptracker.boot.js      # Main logging & BLE interface script
├── sleeptracker.data.json    # Data file saved to internal flash
├── sleeptracker.settings.json# Settings file controlling logging
├── metadata.json             # App metadata for App Loader
├── app.png                   # Icon for launcher (48x48)
└── README.md                 # This file
```

---

## 🤝 Contributing

PRs are welcome! Suggestions, bug fixes, or improvements are appreciated.

1. Fork this repo
2. Test changes on Bangle.js
3. Submit a Pull Request

