import { useSleep } from "@/context/SleepContext"
import { useEffect, useState } from "react"

const WatchUI = () => {
  const sleep = useSleep()
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      setCurrentDate(new Date().toLocaleDateString([], { month: "2-digit", day: "2-digit", year: "2-digit" }))
    }

    updateTime()
    const interval = setInterval(updateTime, 60 * 1000) // update every minute
    return () => clearInterval(interval)
  }, [])

  const getMetricValue = (title: string) =>
      sleep?.analysis?.metrics?.find((m) => m.title === title)?.value ?? "--"

  const duration = getMetricValue("Sleep Duration")
  const quality = getMetricValue("Sleep Quality")

  return (
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          {/* Watch face */}
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black border-8 border-gray-300 dark:border-gray-600 shadow-2xl relative overflow-hidden">
            {/* Bezel */}
            <div className="absolute inset-2 rounded-full border-2 border-gray-400 dark:border-gray-500"></div>

            {/* Screen */}
            <div className="absolute inset-4 rounded-full bg-black flex flex-col items-center justify-center text-white">
              <div className="text-3xl font-light mb-1">{currentTime}</div>
              <div className="text-sm text-gray-400 mb-4">{currentDate}</div>

              {/* Sleep indicators */}
              <div className="flex space-x-4 text-center">
                <div>
                  <div className="text-xs text-blue-400">SLEEP</div>
                  <div className="text-sm font-medium">{duration}</div>
                </div>
                <div>
                  <div className="text-xs text-green-400">QUALITY</div>
                  <div className="text-sm font-medium">{quality}</div>
                </div>
              </div>
            </div>

            {/* Crown & Buttons */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-8 bg-gray-300 dark:bg-gray-600 rounded-l-md"></div>
            <div className="absolute right-0 top-1/3 transform -translate-y-1/2 w-2 h-4 bg-gray-300 dark:bg-gray-600 rounded-l-sm"></div>
            <div className="absolute right-0 bottom-1/3 transform translate-y-1/2 w-2 h-4 bg-gray-300 dark:bg-gray-600 rounded-l-sm"></div>

            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-30 animate-pulse-ring"></div>
          </div>

          {/* Watch band */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-12 bg-gray-800 dark:bg-gray-700 rounded-t-lg"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 w-8 h-12 bg-gray-800 dark:bg-gray-700 rounded-b-lg"></div>
        </div>

        {/* Connection status */}
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-2 h-2 ${sleep?.isConnected?'bg-green-500':'bg-red-500'} rounded-full animate-pulse`}></div>
          <span className="text-sm text-muted-foreground">{`${sleep?.isConnected?'Connected':'Disconnect'} to Bangle JS`}</span>
        </div>
      </div>
  )
}

export default WatchUI
