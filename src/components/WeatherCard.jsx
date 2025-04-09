import { useEffect, useState } from "react"
import { RefreshCw, Droplets, Wind, Thermometer } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { WeatherAnimation } from "./WeatherAnimatioin"
import { useWeatherContext } from "../context/weatherTheme"
import { WeatherBackground } from "./WeatherBackground"

export function WeatherCard({ weather, onRefresh, isFallback }) {
  // const [timeOfDay, setTimeOfDay] = useState("day")
  const [animatedIn, setAnimatedIn] = useState(false)
  const { bgGradient, weatherType, timeOfDay } = useWeatherContext()

  useEffect(() => {
    setAnimatedIn(false)
    setTimeout(() => setAnimatedIn(true), 100)
  }, [weather])

  if (!weather) return null

  const { name, main, weather: weatherDetails, wind, sys } = weather
  const weatherIcon = weatherDetails[0].icon
  // const weatherType = weatherDetails[0].main.toLowerCase()
  const weatherDescription = weatherDetails[0].description
  const temperature = Math.round(main.temp)
  const feelsLike = Math.round(main.feels_like)
  const humidity = main.humidity
  const windSpeed = (wind.speed * 3.6).toFixed(1) // Convert m/s to km/h

  // Dynamic background based on weather and time of day
  const getBackgroundStyle = () => {
    const baseGradients = {
      clear: {
        day: "from-sky-400 to-blue-500",
        night: "from-indigo-900 to-blue-900",
      },
      clouds: {
        day: "from-gray-300 to-blue-400",
        night: "from-gray-800 to-slate-900",
      },
      rain: {
        day: "from-gray-400 to-slate-600",
        night: "from-gray-900 to-slate-800",
      },
      snow: {
        day: "from-slate-200 to-blue-200",
        night: "from-slate-700 to-blue-900",
      },
      thunderstorm: {
        day: "from-gray-700 to-slate-900",
        night: "from-gray-900 to-slate-950",
      },
      drizzle: {
        day: "from-gray-300 to-blue-400",
        night: "from-gray-800 to-slate-900",
      },
      mist: {
        day: "from-gray-300 to-slate-400",
        night: "from-gray-800 to-slate-900",
      },
      fog: {
        day: "from-gray-300 to-slate-400",
        night: "from-gray-800 to-slate-900",
      },
      haze: {
        day: "from-yellow-200 to-orange-300",
        night: "from-yellow-900 to-orange-900",
      },
      dust: {
        day: "from-yellow-300 to-orange-400",
        night: "from-yellow-900 to-orange-900",
      },
      smoke: {
        day: "from-gray-400 to-slate-500",
        night: "from-gray-800 to-slate-900",
      },
    }

    const gradientType = baseGradients[weatherType] || baseGradients.clear
    return gradientType[timeOfDay] || (timeOfDay === "night" ? baseGradients.clear.night : baseGradients.clear.day)
  }

  // useEffect(() => {
  //   if (weather) {
  //     setBgGradient(getBackgroundStyle())
  //   }
  //   console.log(bgGradient)
  // }, [weather, timeOfDay])

  return (
    <Card
      className={`overflow-hidden  min-h-[55vh] bg-gradient-to-r ${getBackgroundStyle()} transform transition-all duration-500 ${animatedIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <WeatherBackground/>
      <CardHeader className={` text-white relative overflow-hidden`}>
        <div className="absolute inset-0 z-0">
          <WeatherAnimation weatherType={weatherType} timeOfDay={timeOfDay} />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <CardTitle className="text-3xl font-bold text-shadow">
              {name}, {sys.country}
            </CardTitle>
            <p className="text-sm opacity-90 text-shadow">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {isFallback && " (Using fallback data)"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="text-white hover:bg-white/20 transition-transform hover:rotate-180 duration-500"
          >
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex items-center justify-center p-6 ">
            <img
              src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
              alt={weatherDescription}
              className="w-32 h-32 drop-shadow-lg animate-pulse"
            />
            <div>
              <div className="flex items-end">
                <p className="text-6xl font-bold">{temperature}°</p>
                <p className="text-xl ml-1 mb-2">C</p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 capitalize text-lg">{weatherDescription}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Thermometer className="h-4 w-4 mr-1 text-orange-500" />
                Feels like: {feelsLike}°C
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 p-6 ">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-gray-700/50 shadow-sm transition-all hover:shadow-md">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Droplets className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                <div className="flex items-center">
                  <p className="font-medium text-xl">{humidity}%</p>
                  <div className="ml-2 w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${humidity}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-gray-700/50 shadow-sm transition-all hover:shadow-md">
              <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-full">
                <Wind className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
                <div className="flex items-center">
                  <p className="font-medium text-xl">{windSpeed} km/h</p>
                  <div className="ml-2 relative">
                    <div className="w-5 h-5 border-2 border-cyan-500 rounded-full flex items-center justify-center">
                      <div
                        className="w-3 h-0.5 bg-cyan-500 absolute origin-center transition-transform duration-500"
                        style={{ transform: `rotate(${wind.deg}deg)` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
