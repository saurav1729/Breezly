"use client"

import { useState, useRef, useEffect } from "react"
import { SearchIcon, MapPin, History } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { motion, AnimatePresence } from "framer-motion"

export function Search({ onSearch, initialValue = "" }) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const popularCities = [
    "New York",
    "London",
    "Tokyo",
    "Paris",
    "Sydney",
    "Dubai",
    "Singapore",
    "Mumbai",
    "Berlin",
    "Toronto",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsSubmitting(true)
      setTimeout(() => {
        onSearch(searchTerm.trim())
        setIsSubmitting(false)
      }, 500)
    }
  }

  const handleCityClick = (city) => {
    setSearchTerm(city)
    onSearch(city)
    setIsFocused(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative max-w-md mx-auto" ref={inputRef}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="pl-11 outline-none pr-11 h-7 text-base rounded-full outline-none border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>

        <Button
          type="submit"
          className="w-full h-7 rounded-lg text-base font-medium bg-gray-300 hover:bg-blue-700 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Searching...</span>
            </div>
          ) : (
            "Search Weather"
          )}
        </Button>
      </form>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-2 w-full bg-white rounded-md shadow-md border border-gray-200"
          >
            <div className="p-3">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <History className="h-4 w-4 mr-1" />
                <span>Popular Cities</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularCities.slice(0, 6).map((city) => (
                  <div
                    key={city}
                    className="px-3 py-2 text-sm bg-gray-50 hover:bg-blue-100 rounded cursor-pointer transition"
                    onClick={() => handleCityClick(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
