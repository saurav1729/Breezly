
import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/theme"
import { WeatherContextProvider } from "./context/weatherTheme"
import { WeatherBackground } from "./components/WeatherBackground"
import HomePage from "./pages/Home"
import ForecastPage from "./pages/forecastPage"

function App() {

  return (

          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/forecast/:city" element={<ForecastPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
  )
}

export default App
