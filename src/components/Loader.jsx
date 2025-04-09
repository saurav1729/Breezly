"use client"

import { motion } from "framer-motion"

export function Loader() {
  return (
    <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-20 h-20 border-4 border-blue-300 dark:border-blue-700 border-t-blue-500 dark:border-t-blue-400 rounded-full"
          />

          {/* Cloud elements */}
          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-6 bg-white dark:bg-gray-300 rounded-full"
          />
          <motion.div
            animate={{ x: [10, -10, 10] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 w-8 h-5 bg-white dark:bg-gray-300 rounded-full"
          />
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="mt-4 text-blue-600 dark:text-blue-400 font-medium"
        >
          Loading weather data...
        </motion.p>
      </motion.div>
    </div>
  )
}
