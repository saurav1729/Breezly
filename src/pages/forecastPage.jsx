import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, CalendarDays, Clock, Droplets, Thermometer, Wind } from "lucide-react"
import DarkModeBtn from "../components/ThemeToggle"
import { Loader } from "../components/Loader"
import { ErrorDisplay } from "../components/ErrorDisplay"
import { useWeatherContext } from "../context/weatherTheme"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { ThemeProvider } from "../context/theme"
import { WeatherBackground } from "../components/WeatherBackground"
import { useRef } from "react"


// Sample forecast data structure (simplified)
const fallbackForecastData = {
  list: [
    {
      dt: 1744156800,
      main: {
        temp: 32.5,
        feels_like: 30.2,
        temp_min: 32.5,
        temp_max: 32.5,
        pressure: 1010,
        humidity: 15,
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
      dt_txt: "2025-04-09 12:00:00",
    },
    // ... other forecast entries (truncated for brevity)
  ],
  city: {
    id: 1273294,
    name: "Delhi",
    coord: {
      lat: 28.6667,
      lon: 77.2167,
    },
    country: "IN",
    timezone: 19800,
  },
}

export default function ForecastPage() {
  const { city } = useParams()
  const [darkMode, setDarkMode] = useState(() => {
    const isDark = localStorage.getItem("darkMode")
    return isDark === "true"
  })

  const navigate = useNavigate()
  const hourlyRef = useRef(null);

  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [useFallback, setUseFallback] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [averageWeather, setAverageWeather] = useState({ type: "clear", timeOfDay: "day" })
  const { setWeatherType, setTimeOfDay, bgGradient,  } = useWeatherContext()

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; 
  const BASE_URL = "https://api.openweathermap.org/data/2.5"

  useEffect(() => {
    if (!city) {
      navigate("/")
      return
    }

    fetchForecast(city)
    setTimeout(() => setPageLoaded(true), 500)
  }, [city, navigate])

  const fetchForecast = async (cityName) => {
    if (!cityName) return

    setLoading(true)
    setError(null)

    try {
      // Fetch 5-day forecast
      const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)

      if (!forecastResponse.ok) {
        throw new Error(`Forecast data unavailable: ${forecastResponse.statusText}`)
      }

      const forecastData = await forecastResponse.json()
      setForecast(forecastData)
      setUseFallback(false)

      // Calculate average weather type for the 5-day period
      calculateAverageWeather(forecastData)
    } catch (err) {
      console.error("Error fetching forecast data:", err)
      setError(err.message)

      if (cityName.toLowerCase() === "delhi") {
        setForecast(fallbackForecastData)
        setUseFallback(true)
        setError(null)
        calculateAverageWeather(fallbackForecastData)
      } else {
        setForecast(null)
      }
    } finally {
      setLoading(false)
    }
  }

  // Calculate the most common weather type across the 5-day forecast
  const calculateAverageWeather = (forecastData) => {
    if (!forecastData || !forecastData.list || forecastData.list.length === 0) return

    // Count occurrences of each weather type
    const weatherCounts = {}

    forecastData.list.forEach((item) => {
      const weatherType = item.weather[0].main.toLowerCase()
      weatherCounts[weatherType] = (weatherCounts[weatherType] || 0) + 1
    })

    // Find the most common weather type
    let mostCommonType = "clear"
    let highestCount = 0

    for (const [type, count] of Object.entries(weatherCounts)) {
      if (count > highestCount) {
        highestCount = count
        mostCommonType = type
      }
    }

    // Determine if most forecasts are during day or night
    const currentTime = new Date().getHours()
    const timeOfDay = currentTime >= 6 && currentTime < 18 ? "day" : "night"

    setAverageWeather({ type: mostCommonType, timeOfDay })

    // Update the global weather context
    setWeatherType(mostCommonType)
    setTimeOfDay(timeOfDay)
  }

  // Group forecast data by day
  const groupForecastsByDay = (forecastList) => {
    return forecastList.reduce((days, forecast) => {
      // Extract the date part only
      const date = forecast.dt_txt.split(" ")[0]

      if (!days[date]) {
        days[date] = []
      }

      days[date].push(forecast)
      return days
    }, {})
  }

  // Get daily summary for each day (average temp, dominant weather)
  const getDailySummaries = (groupedForecasts) => {
    return Object.entries(groupedForecasts).map(([date, forecasts]) => {
      // Calculate average temperature
      const totalTemp = forecasts.reduce((sum, f) => sum + f.main.temp, 0)
      const avgTemp = totalTemp / forecasts.length

      // Find most common weather type
      const weatherTypes = {}
      forecasts.forEach((f) => {
        const type = f.weather[0].main
        weatherTypes[type] = (weatherTypes[type] || 0) + 1
      })

      let dominantWeather = forecasts[0].weather[0]
      let maxCount = 0

      for (const [type, count] of Object.entries(weatherTypes)) {
        if (count > maxCount) {
          maxCount = count
          // Find a forecast with this weather type to get its icon and description
          dominantWeather = forecasts.find((f) => f.weather[0].main === type).weather[0]
        }
      }

      // Get min and max temps
      const minTemp = Math.min(...forecasts.map((f) => f.main.temp))
      const maxTemp = Math.max(...forecasts.map((f) => f.main.temp))

      // Get midday forecast if available
      const middayForecast = forecasts.find((f) => f.dt_txt.includes("12:00:00")) || forecasts[0]

      return {
        date,
        avgTemp,
        minTemp,
        maxTemp,
        weather: dominantWeather,
        forecasts,
        middayForecast,
      }
    })
  }

  const goBack = () => {
    navigate("/")
  }


  useEffect(() => {
    if (selectedDay && hourlyRef.current) {
      hourlyRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedDay]);
  

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 relative z-10 cursor-pointer">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={goBack} variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          <DarkModeBtn />
        </div>
        <Loader />
      </div>
    )

  if (error)
    return (
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={goBack} variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          <DarkModeBtn />
        </div>
        <ErrorDisplay message={error} />
      </div>
    )

  if (!forecast)
    return (
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={goBack} variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          <DarkModeBtn />
        </div>
        <div
          className={`backdrop-blur-md rounded-lg shadow-lg p-6 text-center ${
            darkMode ? "bg-gray-900/30 border border-gray-800/50" : "bg-white/30 border border-gray-200/50"
          }`}
        >
          <p className="text-gray-600 dark:text-gray-300">No forecast data available</p>
        </div>
      </div>
    )


    const getBackgroundStyle = () => {
        // const weatherType = getWeather)
    
        const backgrounds = {
          clear: darkMode
            ? "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900"
            : "bg-gradient-to-br from-blue-50 via-blue-100 to-sky-100",
          clouds: darkMode
            ? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"
            : "bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200",
          rain: darkMode
            ? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"
            : "bg-gradient-to-br from-gray-200 via-slate-300 to-gray-200",
          snow: darkMode
            ? "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
            : "bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100",
          thunderstorm: darkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900"
            : "bg-gradient-to-br from-gray-300 via-purple-100 to-gray-300",
          default: darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-100 to-white",
        }
    
        return backgrounds[averageWeather] || backgrounds.default
      }

      const toggleDarkMode = () => {
        setDarkMode((prev) => !prev)
      }
    

  // Group forecasts by day and get daily summaries
  const groupedForecasts = groupForecastsByDay(forecast.list)
  const dailySummaries = getDailySummaries(groupedForecasts)

  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode }}>
      <div className={`min-h-screen transition-colors  duration-1000 ${getBackgroundStyle()}`}>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <Button onClick={goBack} variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">5-Day Forecast</span>
            </h1>
          </div>
          <DarkModeBtn />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            className={`backdrop-blur-md ${
              darkMode ? "bg-gray-900/30 border-gray-800/50" : "bg-white/30 border-gray-200/50"
            } mb-6`}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-500" />
                  <span>
                    {forecast.city.name}, {forecast.city.country}
                  </span>
                </div>
                {useFallback && <span className="text-sm opacity-75">(Using fallback data)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
                <WeatherBackground/>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {dailySummaries.map((day) => (
                  <motion.div
                    key={day.date}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-lg p-4 cursor-pointer transition-all ${
                      selectedDay === day.date
                        ? darkMode
                          ? "bg-blue-900/50 border border-blue-700"
                          : "bg-blue-100/70 border border-blue-300"
                        : darkMode
                          ? "bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50"
                          : "bg-white/30 border border-gray-200/50 hover:bg-white/50"
                    }`}
                    onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}
                  >
                    <div className="text-center">
                      <p className="font-medium text-lg">
                        {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>

                      <div className="my-2 flex justify-center">
                        <img
                          src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                          alt={day.weather.description}
                          className="w-16 h-16"
                        />
                      </div>

                      <div className="flex justify-center items-center gap-2">
                        <span className="text-sm font-medium">{Math.round(day.minTemp)}°</span>
                        <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${((day.avgTemp - day.minTemp) / (day.maxTemp - day.minTemp)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{Math.round(day.maxTemp)}°</span>
                      </div>

                      <p className="mt-2 text-base font-bold">{Math.round(day.avgTemp)}°C</p>
                      <p className="text-xs capitalize text-gray-600 dark:text-gray-300">{day.weather.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {selectedDay && (
          <motion.div
            ref={hourlyRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <Card
              className={`backdrop-blur-md ${
                darkMode ? "bg-gray-900/30 border-gray-800/50" : "bg-white/30 border-gray-200/50"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Hourly Forecast for {formatDate(selectedDay)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-max">
                    {groupedForecasts[selectedDay].map((hourForecast, index) => (
                      <motion.div
                        key={hourForecast.dt_txt}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`min-w-[140px] rounded-lg p-4 ${
                          darkMode
                            ? "bg-gray-800/50 border border-gray-700/50"
                            : "bg-white/50 border border-gray-200/50"
                        }`}
                      >
                        <div className="text-center">
                          <p className="font-medium">{formatTime(hourForecast.dt_txt)}</p>

                          <div className="my-3 flex justify-center">
                            <img
                              src={`https://openweathermap.org/img/wn/${hourForecast.weather[0].icon}@2x.png`}
                              alt={hourForecast.weather[0].description}
                              className="w-16 h-16"
                            />
                          </div>

                          <p className="text-xl font-bold">{Math.round(hourForecast.main.temp)}°C</p>
                          <p className="text-xs capitalize text-gray-600 dark:text-gray-300 mt-1">
                            {hourForecast.weather[0].description}
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center">
                              <Wind className="h-4 w-4 mb-1 text-blue-500" />
                              <span>{(hourForecast.wind.speed * 3.6).toFixed(1)} km/h</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <Droplets className="h-4 w-4 mb-1 text-blue-500" />
                              <span>{hourForecast.main.humidity}%</span>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-center text-xs">
                            <Thermometer className="h-3 w-3 mr-1 text-orange-500" />
                            <span>Feels like: {Math.round(hourForecast.main.feels_like)}°C</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.6 }}
  className="mt-6"
>
  <Tabs
    defaultValue="temperature"
    className={`backdrop-blur-md ${
      darkMode ? "bg-gray-900/30 border border-gray-800/50" : "bg-white/30 border border-gray-200/50"
    } rounded-lg p-4`}
  >
    <TabsList className="grid w-full grid-cols-3 gap-2 mb-4">
      <TabsTrigger value="temperature">Temperature</TabsTrigger>
      <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
      <TabsTrigger value="wind">Wind</TabsTrigger>
    </TabsList>

    {/* Temperature */}
    <TabsContent value="temperature" className="p-2">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pl-3">
          <CardTitle className="text-lg  font-semibold">Temperature Trend</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="relative h-[200px] w-full">
            <div className="absolute inset-0 flex items-end gap-2">
              {dailySummaries.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-blue-500 to-red-500 rounded-t-lg"
                    style={{
                      height: `${Math.max(30, (day.maxTemp / 40) * 180)}px`,
                      opacity: 0.7,
                    }}
                  ></div>
                  <p className="text-xs mt-2 font-medium text-gray-700 dark:text-gray-300">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white">{Math.round(day.maxTemp)}°</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 ml-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>
              Average temperature over 5 days:{" "}
              <span className="font-semibold">
                {Math.round(dailySummaries.reduce((sum, day) => sum + day.avgTemp, 0) / dailySummaries.length)}°C
              </span>
            </p>
            <p>
              Highest:{" "}
              <span className="font-semibold">
                {Math.round(Math.max(...dailySummaries.map((d) => d.maxTemp)))}°C
              </span>{" "}
              | Lowest:{" "}
              <span className="font-semibold">
                {Math.round(Math.min(...dailySummaries.map((d) => d.minTemp)))}°C
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Precipitation */}
    <TabsContent value="precipitation" className="p-2">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 ml-4">
          <CardTitle className="text-lg font-semibold">Precipitation Forecast</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {dailySummaries.map((day) => {
              const weather = day.weather.main.toLowerCase()
              return (
                <div
                  key={day.date}
                  className={`p-3 rounded-lg text-center ${
                    darkMode ? "bg-gray-800/50 text-white" : "bg-white/50 text-gray-900"
                  }`}
                >
                  <p className="font-medium">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <div className="my-2">
                    {weather.includes("rain") || weather.includes("drizzle") ? (
                      <div className="flex flex-col items-center">
                        <Droplets className="h-8 w-8 text-blue-500" />
                        <p className="text-sm mt-1">Likely</p>
                      </div>
                    ) : weather.includes("cloud") ? (
                      <div className="flex flex-col items-center">
                        <Droplets className="h-8 w-8 text-gray-400" />
                        <p className="text-sm mt-1">Possible</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Droplets className="h-8 w-8 text-gray-300" />
                        <p className="text-sm mt-1">Unlikely</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs capitalize">{day.weather.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Wind */}
    <TabsContent value="wind" className="p-2">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 ml-4">
          <CardTitle className="text-lg font-semibold">Wind Conditions</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {dailySummaries.map((day) => {
              const avgWindSpeed =
                day.forecasts.reduce((sum, f) => sum + f.wind.speed, 0) / day.forecasts.length
              return (
                <div
                  key={day.date}
                  className={`p-3 rounded-lg text-center ${
                    darkMode ? "bg-gray-800/50 text-white" : "bg-white/50 text-gray-900"
                  }`}
                >
                  <p className="font-medium">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <div className="my-3 flex justify-center">
                    <Wind className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-lg font-bold">{(avgWindSpeed * 3.6).toFixed(1)} km/h</p>
                  <div className="mt-2 flex justify-center">
                    <div className="relative w-8 h-8 border-2 border-blue-500 rounded-full flex items-center justify-center">
                      <div
                        className="w-4 h-1 bg-blue-500 absolute origin-center"
                        style={{ transform: `rotate(${day.middayForecast.wind.deg}deg)` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</motion.div>

      </div>
    </div>
    </ThemeProvider>
  )
}
