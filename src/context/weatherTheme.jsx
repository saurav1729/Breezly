"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create a context for weather-related styling
const WeatherContext = createContext({
  weatherType: "clear",
  timeOfDay: "day",
  bgGradient: "",
  setWeatherType: () => {},
  setTimeOfDay: () => {},
  setBgGradient: () => {},
})

export const WeatherContextProvider = ({ children }) => {
  const [weatherType, setWeatherType] = useState("clear")
  const [timeOfDay, setTimeOfDay] = useState("day")
  const [bgGradient, setBgGradient] = useState("")
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("darkMode")
      return isDark === "true"
    }
    return false
  })

  // Update background gradient when weather type, time of day, or theme changes
  useEffect(() => {
    setBgGradient(getBackgroundGradient(weatherType, timeOfDay, darkMode))
  }, [weatherType, timeOfDay, darkMode])

  // Listen for theme changes from outside the context
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        const isDark = localStorage.getItem("darkMode") === "true"
        setDarkMode(isDark)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Function to get the appropriate background gradient
  const getBackgroundGradient = (type, time, isDark) => {
    const gradients = {
      clear: {
        day: {
          light: "bg-gradient-to-br from-blue-400 to-sky-300",
          dark: "bg-gradient-to-br from-blue-900 to-indigo-900",
        },
        night: {
          light: "bg-gradient-to-br from-indigo-800 to-blue-700",
          dark: "bg-gradient-to-br from-indigo-950 to-blue-950",
        },
      },
      clouds: {
        day: {
          light: "bg-gradient-to-br from-gray-300 to-blue-200",
          dark: "bg-gradient-to-br from-gray-800 to-slate-900",
        },
        night: {
          light: "bg-gradient-to-br from-gray-600 to-slate-700",
          dark: "bg-gradient-to-br from-gray-900 to-slate-950",
        },
      },
      rain: {
        day: {
          light: "bg-gradient-to-br from-gray-400 to-slate-500",
          dark: "bg-gradient-to-br from-gray-800 to-slate-900",
        },
        night: {
          light: "bg-gradient-to-br from-gray-700 to-slate-800",
          dark: "bg-gradient-to-br from-gray-950 to-slate-950",
        },
      },
      drizzle: {
        day: {
          light: "bg-gradient-to-br from-gray-300 to-blue-300",
          dark: "bg-gradient-to-br from-gray-800 to-blue-900",
        },
        night: {
          light: "bg-gradient-to-br from-gray-600 to-blue-700",
          dark: "bg-gradient-to-br from-gray-900 to-blue-950",
        },
      },
      snow: {
        day: {
          light: "bg-gradient-to-br from-slate-200 to-blue-100",
          dark: "bg-gradient-to-br from-slate-700 to-blue-900",
        },
        night: {
          light: "bg-gradient-to-br from-slate-400 to-blue-300",
          dark: "bg-gradient-to-br from-slate-800 to-blue-950",
        },
      },
      thunderstorm: {
        day: {
          light: "bg-gradient-to-br from-gray-600 to-slate-700",
          dark: "bg-gradient-to-br from-gray-800 to-slate-950",
        },
        night: {
          light: "bg-gradient-to-br from-gray-700 to-slate-800",
          dark: "bg-gradient-to-br from-gray-950 to-purple-950",
        },
      },
      mist: {
        day: {
          light: "bg-gradient-to-br from-gray-300 to-slate-400",
          dark: "bg-gradient-to-br from-gray-800 to-slate-900",
        },
        night: {
          light: "bg-gradient-to-br from-gray-500 to-slate-600",
          dark: "bg-gradient-to-br from-gray-900 to-slate-950",
        },
      },
      fog: {
        day: {
          light: "bg-gradient-to-br from-gray-300 to-slate-400",
          dark: "bg-gradient-to-br from-gray-800 to-slate-900",
        },
        night: {
          light: "bg-gradient-to-br from-gray-500 to-slate-600",
          dark: "bg-gradient-to-br from-gray-900 to-slate-950",
        },
      },
      haze: {
        day: {
          light: "bg-gradient-to-br from-yellow-200 to-orange-300",
          dark: "bg-gradient-to-br from-yellow-900 to-orange-900",
        },
        night: {
          light: "bg-gradient-to-br from-yellow-700 to-orange-800",
          dark: "bg-gradient-to-br from-yellow-950 to-orange-950",
        },
      },
      dust: {
        day: {
          light: "bg-gradient-to-br from-yellow-300 to-orange-400",
          dark: "bg-gradient-to-br from-yellow-900 to-orange-900",
        },
        night: {
          light: "bg-gradient-to-br from-yellow-700 to-orange-800",
          dark: "bg-gradient-to-br from-yellow-950 to-orange-950",
        },
      },
      smoke: {
        day: {
          light: "bg-gradient-to-br from-gray-400 to-slate-500",
          dark: "bg-gradient-to-br from-gray-800 to-slate-900",
        },
        night: {
          light: "bg-gradient-to-br from-gray-600 to-slate-700",
          dark: "bg-gradient-to-br from-gray-900 to-slate-950",
        },
      },
      default: {
        day: {
          light: "bg-gradient-to-br from-blue-100 to-white",
          dark: "bg-gradient-to-br from-gray-900 to-gray-800",
        },
        night: {
          light: "bg-gradient-to-br from-indigo-800 to-blue-700",
          dark: "bg-gradient-to-br from-gray-950 to-blue-950",
        },
      },
    }

    const weatherGradient = gradients[type] || gradients.default
    const timeGradient = weatherGradient[time] || weatherGradient.day
    return isDark ? timeGradient.dark : timeGradient.light
  }

  return (
    <WeatherContext.Provider
      value={{
        weatherType,
        timeOfDay,
        bgGradient,
        setWeatherType,
        setTimeOfDay,
        setBgGradient,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeatherContext = () => useContext(WeatherContext)
