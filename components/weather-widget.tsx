"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, CloudSun } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "partly-cloudy"
  humidity: number
  windSpeed: number
}

// Mock weather data
const mockWeatherData: WeatherData = {
  location: "Lagos",
  temperature: 31,
  condition: "partly-cloudy",
  humidity: 75,
  windSpeed: 12,
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    // In a real app, this would fetch from a weather API
    // For now, we'll use mock data
    setWeather(mockWeatherData)
  }, [])

  if (!weather) {
    return null
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "partly-cloudy":
        return <CloudSun className="h-8 w-8 text-yellow-500" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3">
        <CardTitle className="text-lg">Weather Update</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">{weather.location}</h3>
            <p className="text-3xl font-bold">{weather.temperature}°C</p>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span>Humidity: {weather.humidity}%</span>
              <span className="mx-2">•</span>
              <span>Wind: {weather.windSpeed} km/h</span>
            </div>
          </div>
          <div>{getWeatherIcon(weather.condition)}</div>
        </div>
      </CardContent>
    </Card>
  )
}
