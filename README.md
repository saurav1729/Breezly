# 🌤️ Breezly – Weather Forecast App

**Breezly** is a beautiful and responsive weather forecasting web application built with **React** and **Tailwind CSS**. It provides real-time weather updates, 5-day forecasts, and detailed hourly trends through intuitive animated charts. Whether you're checking the weather for your commute or planning a trip, Breezly makes it easy to stay informed. It also supports a dynamic theme system, dark/light mode, and stores recent search history for a seamless user experience.

![Breezly Banner](./src/assets/pic2.png)

---

## 🚀 Features

- 🔍 **City Weather Search**  
  Search any city worldwide to get real-time weather data powered by the OpenWeatherMap API.

- 🌡️ **Current Weather Overview**  
  Displays current temperature, feels like, weather condition (sunny, cloudy, etc.), humidity, pressure, wind speed, visibility, sunrise/sunset times, and more.

- 📊 **5-Day Forecast & Hourly Charts**  
  - **Line and Bar Charts** for visualizing hourly temperature, precipitation, and wind patterns using Recharts.
  - Forecast data broken into 3-hour segments across the next 5 days.

- 🌓 **Dark/Light Mode Toggle**  
  Users can switch between dark and light themes with smooth transition animations. User preferences are stored and persisted in `localStorage`.

- 🎨 **Dynamic Background Themes**  
  Background visuals adapt based on the time of day (morning, afternoon, evening, night) and weather condition (clear, rainy, stormy, etc.) for a more immersive experience.

- 💾 **Search History**  
  - Last 5 searched cities are saved in `localStorage`.
  - Clickable history entries make re-searching faster.

- ⚠️ **Fallback Data Support**  
  In case the API fails or rate limits are hit, the app shows default weather data for Delhi to maintain user experience.

---

## 🛠️ Tech Stack

| Tool               | Purpose                          |
|--------------------|----------------------------------|
| **React**          | Frontend library                 |
| **Tailwind CSS**   | Utility-first styling framework  |
| **Framer Motion**  | Smooth animations                |
| **Recharts**       | Chart rendering for forecasts    |
| **OpenWeatherMap** | Weather data API                 |
| **React Icons**    | Weather & UI icons               |
| **LocalStorage**   | Theme & history persistence      |

---

## 🖼️ Screenshots & Preview

![Home Page](./src/assets/1.png)  
_Real-time weather and search bar_

![Forecast Page](./src/assets/pic5.png)  
_5-day forecast with hourly charts_

![Dark Mode](./src/assets/pic6.png)  
_Dark mode interface_

![Dynamic Background](./src/assets/pic7.png)  
_Background changes according to weather and time_

---

## 🧪 Live Demo

You can deploy the app on Vercel, Netlify, or GitHub Pages.  
🔗 [Live Demo](https://breezly-henna.vercel.app/)

---

## 📦 Installation & Setup

Follow these steps to run Breezly locally:

### 1. Clone the Repository

```bash
git clone https://github.com/sauravjha1111/breezly-weather-app.git
cd breezly-weather-app
