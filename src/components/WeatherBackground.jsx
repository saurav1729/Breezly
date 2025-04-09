import { useEffect, useRef } from "react"
import { useWeatherContext } from "../context/weatherTheme"
import { WeatherAnimation } from "./WeatherAnimatioin"

export function WeatherBackground() {
  const { weatherType, timeOfDay } = useWeatherContext()
  return (
    <WeatherAnimation weatherType={weatherType} timeOfDay={timeOfDay} home = "true"/>
  ); 

}
