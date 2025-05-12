"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ExchangeRate {
  currency: string
  rate: number
  change: number
}

// Mock exchange rate data
const mockExchangeRates: ExchangeRate[] = [
  { currency: "USD", rate: 1550, change: 5.2 },
  { currency: "EUR", rate: 1680, change: -1.3 },
  { currency: "GBP", rate: 1950, change: 0.8 },
  { currency: "CAD", rate: 1130, change: 0 },
]

export function ExchangeRatesWidget() {
  const [rates, setRates] = useState<ExchangeRate[]>([])

  useEffect(() => {
    // In a real app, this would fetch from an exchange rate API
    // For now, we'll use mock data
    setRates(mockExchangeRates)
  }, [])

  if (rates.length === 0) {
    return null
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getChangeClass = (change: number) => {
    if (change > 0) {
      return "text-green-500"
    } else if (change < 0) {
      return "text-red-500"
    } else {
      return "text-gray-500"
    }
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3">
        <CardTitle className="text-lg">Exchange Rates (₦)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {rates.map((rate) => (
            <li key={rate.currency} className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{rate.currency}</div>
                <div className="flex items-center gap-2">
                  <span>₦{rate.rate.toLocaleString()}</span>
                  <div className={`flex items-center ${getChangeClass(rate.change)}`}>
                    {getChangeIcon(rate.change)}
                    <span className="ml-1 text-sm">{Math.abs(rate.change)}%</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
