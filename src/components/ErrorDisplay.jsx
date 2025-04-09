
import { CloudOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { motion } from "framer-motion"

export function ErrorDisplay({ message }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex flex-col items-center text-center p-4">
          <motion.div
            animate={{
              rotate: [-5, 5, -5],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mb-4 text-red-500 dark:text-red-400"
          >
            <CloudOff size={50} />
          </motion.div>

          <AlertTitle className="text-xl mb-2 text-red-700 dark:text-red-300">Weather Data Unavailable</AlertTitle>
          <AlertDescription className="text-red-600 dark:text-red-400">
            {message || "An error occurred while fetching weather data. Please try again."}
          </AlertDescription>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Try searching for a different city or check your internet connection.</p>
          </div>
        </div>
      </Alert>
    </motion.div>
  )
}
