"use client"

import { Clock } from "lucide-react"
import { Button } from "./ui/button"
import { motion } from "framer-motion"

export function SearchHistory({ history, onItemClick }) {
  if (!history.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Searches</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((city, index) => (
          <motion.div
            key={`${city}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all duration-300"
              onClick={() => onItemClick(city)}
            >
              {city}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
