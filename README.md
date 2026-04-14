<h1 align="center">🌤️ WeatherNow</h1>
<p align="center">
  <strong>A beautifully designed, real-time weather dashboard with a dark glassmorphism UI.</strong><br/>
  Search any city worldwide, auto-detect your location, and view live weather conditions at a glance.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/OpenWeatherMap-API-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## ✨ Features

- 🌡️ **Current Weather** — Temperature, feels like, humidity, wind speed, visibility, and pressure
- 📅 **5-Day Forecast** — Daily high/low with weather icons
- 📍 **Geolocation** — Auto-detect current location with one click
- 🌍 **City Search** — Search any city with a live suggestion dropdown
- 🔄 **°C / °F Toggle** — Switch temperature units instantly
- 🎨 **Glassmorphism UI** — Dark theme with animated gradient background orbs
- 🚀 **Demo Mode** — Works out of the box without an API key (pre-loaded cities)
- 📱 **Responsive Design** — Fully optimized for mobile and desktop

---

## 🖥️ Live Preview

> Open `index.html` in your browser — demo mode loads Karachi weather by default.
>
> **Quick cities:** Karachi · Lahore · London · New York · Tokyo · Dubai

---

## 🔑 Enable Live Weather Data

1. Get a **free API key** at [openweathermap.org](https://openweathermap.org/api)
2. Open `script.js`
3. Replace `YOUR_API_KEY_HERE` with your key
4. Set `DEMO_MODE = false`

```js
const API_KEY   = 'your_key_here';   // ← paste your key
const DEMO_MODE = false;             // ← disable demo mode
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure & Semantics |
| CSS3 | Glassmorphism styling, animations, responsive layout |
| JavaScript (ES6+) | Weather logic, API integration, geolocation |
| OpenWeatherMap API | Live weather & forecast data |

---

## 📁 Project Structure

```
weathernow-app/
├── index.html    # App structure
├── style.css     # Dark glassmorphism theme
└── script.js     # Weather logic, demo data & API integration
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/qasim-safi/weathernow-app.git
cd weathernow-app

# Open in browser
open index.html
# Or just double-click index.html
```

No build tools or dependencies required. Pure HTML, CSS, and JavaScript.

---

## 👨‍💻 Developer

**Qasim Safi** — BS Software Engineering Student  
🌐 Django Web Dev | 📱 Flutter App Dev | 🐍 Python & Java  

[![GitHub](https://img.shields.io/badge/GitHub-qasim--safi-181717?style=flat-square&logo=github)](https://github.com/qasim-safi)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and modify it.
