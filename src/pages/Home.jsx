import { useEffect, useState } from "react"
import DarkModeBtn from "../components/ThemeToggle"
import { ThemeProvider } from "../context/theme"
import { Search } from "../components/Search"
import { WeatherCard } from "../components/WeatherCard"
// import { ForecastSection } from "../components/ForeCastSection"
import { SearchHistory } from "../components/SearchHistory"
import { Loader } from "../components/Loader"
import { ErrorDisplay } from "../components/ErrorDisplay"
import { motion } from "framer-motion"
import { useWeatherContext } from "../context/weatherTheme"
import { Button } from "../components/ui/button"
import { CalendarDays, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"


const fallbackWeatherData = {
    coord: {
        lon: 77.2167,
        lat: 28.6667,
    },
    weather: [
        {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01n",
        },
    ],
    base: "stations",
    main: {
        temp: 30.85,
        feels_like: 28.86,
        temp_min: 30.85,
        temp_max: 30.85,
        pressure: 1009,
        humidity: 17,
        sea_level: 1009,
        grnd_level: 984,
    },
    visibility: 10000,
    wind: {
        speed: 2.81,
        deg: 120,
        gust: 7.58,
    },
    clouds: {
        all: 2,
    },
    dt: 1744145415,
    sys: {
        country: "IN",
        sunrise: 1744158723,
        sunset: 1744204381,
    },
    timezone: 19800,
    id: 1273294,
    name: "Delhi",
    cod: 200,
}


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
        {
            dt: 1744167600,
            main: {
                temp: 33.8,
                feels_like: 31.5,
                temp_min: 33.8,
                temp_max: 33.8,
                pressure: 1008,
                humidity: 14,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01d",
                },
            ],
            dt_txt: "2025-04-09 15:00:00",
        },
        {
            dt: 1744178400,
            main: {
                temp: 31.2,
                feels_like: 29.3,
                temp_min: 31.2,
                temp_max: 31.2,
                pressure: 1007,
                humidity: 18,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01n",
                },
            ],
            dt_txt: "2025-04-09 18:00:00",
        },
        {
            dt: 1744189200,
            main: {
                temp: 28.5,
                feels_like: 27.1,
                temp_min: 28.5,
                temp_max: 28.5,
                pressure: 1009,
                humidity: 22,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01n",
                },
            ],
            dt_txt: "2025-04-09 21:00:00",
        },
        {
            dt: 1744200000,
            main: {
                temp: 26.3,
                feels_like: 26.3,
                temp_min: 26.3,
                temp_max: 26.3,
                pressure: 1008,
                humidity: 25,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01n",
                },
            ],
            dt_txt: "2025-04-10 00:00:00",
        },
        {
            dt: 1744210800,
            main: {
                temp: 25.1,
                feels_like: 24.6,
                temp_min: 25.1,
                temp_max: 25.1,
                pressure: 1010,
                humidity: 28,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01n",
                },
            ],
            dt_txt: "2025-04-10 03:00:00",
        },
        {
            dt: 1744221600,
            main: {
                temp: 24.2,
                feels_like: 23.8,
                temp_min: 24.2,
                temp_max: 24.2,
                pressure: 1011,
                humidity: 30,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01d",
                },
            ],
            dt_txt: "2025-04-10 06:00:00",
        },
        {
            dt: 1744232400,
            main: {
                temp: 29.8,
                feels_like: 28.4,
                temp_min: 29.8,
                temp_max: 29.8,
                pressure: 1012,
                humidity: 19,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01d",
                },
            ],
            dt_txt: "2025-04-10 09:00:00",
        },
        {
            dt: 1744243200,
            main: {
                temp: 32.9,
                feels_like: 30.7,
                temp_min: 32.9,
                temp_max: 32.9,
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
            dt_txt: "2025-04-10 12:00:00",
        },
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

function HomePage() {
    const [darkMode, setDarkMode] = useState(() => {
        const isDark = localStorage.getItem("darkMode")
        return isDark === "true"
    })

    const navigate = useNavigate();

    const [city, setCity] = useState("Delhi") // Default to Delhi
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchHistory, setSearchHistory] = useState(["Delhi"])
    const [useFallback, setUseFallback] = useState(false)
    const [pageLoaded, setPageLoaded] = useState(false)
    const { weatherType, timeOfDay, setWeatherType, setTimeOfDay } = useWeatherContext()

    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY ;
    const BASE_URL = "https://api.openweathermap.org/data/2.5"

    useEffect(() => {
        const savedHistory = localStorage.getItem("searchHistory")
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory))
        }

        fetchWeather("Delhi")

        setTimeout(() => setPageLoaded(true), 500)
    }, [])

    useEffect(() => {
        if (weather && weather.weather && weather.weather[0] && weather.sys) {
            setWeatherType(weather.weather[0].main.toLowerCase())
            const currentTime = new Date().getTime() / 1000
            const sunrise = weather.sys.sunrise
            const sunset = weather.sys.sunset
            setTimeOfDay(currentTime > sunrise && currentTime < sunset ? "day" : "night")
        }
    }, [weather, setWeatherType, setTimeOfDay])


    const fetchWeather = async (cityName) => {
        if (!cityName) return

        setLoading(true)
        setError(null)

        try {
            //current weather fetching
            const weatherResponse = await fetch(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`)

            if (!weatherResponse.ok) {
                throw new Error(`City not found or API error: ${weatherResponse.statusText}`)
            }

            const weatherData = await weatherResponse.json()
            setWeather(weatherData)

            // 5-day forecast
            const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)

            if (!forecastResponse.ok) {
                throw new Error(`Forecast data unavailable: ${forecastResponse.statusText}`)
            }

            const forecastData = await forecastResponse.json()
            setForecast(forecastData)
            setUseFallback(false)

            updateSearchHistory(cityName)
        } catch (err) {
            console.error("Error fetching weather data:", err)
            setError(err.message)

            if (cityName.toLowerCase() === "delhi") {
                setWeather(fallbackWeatherData)
                setForecast(fallbackForecastData)
                setUseFallback(true)
                setError(null)
            } else {
                setWeather(null)
                setForecast(null)
            }
        } finally {
            setLoading(false)
        }
    }

    const updateSearchHistory = (cityName) => {
        const updatedHistory = [
            cityName,
            ...searchHistory.filter((item) => item.toLowerCase() !== cityName.toLowerCase()),
        ].slice(0, 5)

        setSearchHistory(updatedHistory)
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
    }

    const handleSearch = (searchCity) => {
        setCity(searchCity)
        fetchWeather(searchCity)
    }

    const handleHistoryItemClick = (historyCity) => {
        setCity(historyCity)
        fetchWeather(historyCity)
    }

    const handleRefresh = () => {
        fetchWeather(city)
    }

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev)
    }

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode.toString())

        const bodyEl = document.body
        if (bodyEl) {
            if (darkMode) {
                bodyEl.classList.add("dark")
            } else {
                bodyEl.classList.remove("dark")
            }
        }
    }, [darkMode])


    const getWeatherType = () => {
        if (!weather || !weather.weather || !weather.weather[0]) return "clear"
        return weather.weather[0].main.toLowerCase()
    }


    const getBackgroundStyle = () => {
        const weatherType = getWeatherType()

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

        return backgrounds[weatherType] || backgrounds.default
    }

    const goToForecast = () => {
        navigate(`/forecast/${city}`)
    }


    return (
        <ThemeProvider value={{ darkMode, toggleDarkMode }}>
            <div className={`min-h-screen transition-colors duration-1000 ${getBackgroundStyle()}`}>
                <div className="container mx-auto px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-between items-center mb-8"
                    >
                        <h1 className="text-3xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            <span className="text-blue-600 dark:text-blue-400">Breezly</span>
                        </h1>

                        <div className="flex items-center gap-4">

                            <a
                                href="https://github.com/saurav1729"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                >
                                    <path d="M12 0C5.373 0 0 5.373 0 12a12.06 12.06 0 0 0 8.207 11.434c.6.113.82-.258.82-.577 0-.285-.011-1.04-.017-2.042-3.338.724-4.042-1.609-4.042-1.609-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.836 2.809 1.305 3.493.997.108-.775.418-1.305.76-1.605-2.664-.305-5.466-1.333-5.466-5.93 0-1.31.468-2.382 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.518 11.518 0 0 1 3.003-.404c1.02.005 2.048.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.119 3.176.77.838 1.234 1.91 1.234 3.22 0 4.61-2.806 5.624-5.478 5.921.43.37.813 1.102.813 2.222 0 1.606-.015 2.902-.015 3.296 0 .32.218.694.826.576A12.06 12.06 0 0 0 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>


                            <DarkModeBtn />
                        </div>
                    </motion.div>


                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: pageLoaded ? 1 : 0, x: pageLoaded ? 0 : -20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-6">
                                <Search onSearch={handleSearch} initialValue={city} />

                                {searchHistory.length > 0 && (
                                    <SearchHistory history={searchHistory} onItemClick={handleHistoryItemClick} />
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: pageLoaded ? 1 : 0, x: pageLoaded ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="lg:col-span-3"
                        >
                            {loading ? (
                                <Loader />
                            ) : error ? (
                                <ErrorDisplay message={error} />
                            ) : weather ? (
                                <div className="space-y-6">
                                    <WeatherCard weather={weather} onRefresh={handleRefresh} isFallback={useFallback} />

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                        className={`rounded-lg overflow-hidden backdrop-blur-md ${darkMode ? "bg-gray-900/30 border border-gray-800/50" : "bg-white/30 border border-gray-200/50"
                                            } py-2 mt-[-20px] shadow-lg text-center`}
                                    >
                                        <Button
                                            onClick={goToForecast}
                                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white  rounded-lg flex items-center justify-center gap-2 text-lg"
                                        >
                                            <CalendarDays className="h-3 w-5" />
                                            View 5-Day Forecast
                                            <ChevronRight className="h-3 w-5" />
                                        </Button>
                                    </motion.div>
                                </div>
                            ) : (
                                <div
                                    className={`backdrop-blur-md rounded-lg shadow-lg p-6 text-center ${darkMode ? "bg-gray-900/30 border border-gray-800/50" : "bg-white/30 border border-gray-200/50"
                                        }`}
                                >
                                    <p className="text-gray-600 dark:text-gray-300">Search for a city to see the weather forecast</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default HomePage
