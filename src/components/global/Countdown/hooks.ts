import { useEffect, useState } from 'react'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const useTimeLeft = (date: Date, useDoubleDigits: boolean = true) => {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(date, useDoubleDigits)
  )
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date, useDoubleDigits))
    }, 1000)
    return () => clearInterval(timer)
  }, [date.getTime()])
  return timeLeft
}

export const calculateTimeLeft = (
  date: Date,
  useDoubleDigits: boolean = true
) => {
  const now = new Date()
  const difference = date.getTime() - now.getTime()

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((difference / 1000 / 60) % 60)
    const seconds = Math.floor((difference / 1000) % 60)
    return {
      timeLeft: {
        days: useDoubleDigits ? doubleDigits(days) : days,
        hours: useDoubleDigits ? doubleDigits(hours) : hours,
        minutes: useDoubleDigits ? doubleDigits(minutes) : minutes,
        seconds: useDoubleDigits ? doubleDigits(seconds) : seconds,
      },
      countdownCompleted: false,
    }
  } else {
    return {
      timeLeft: {
        days: useDoubleDigits ? doubleDigits(0) : 0,
        hours: useDoubleDigits ? doubleDigits(0) : 0,
        minutes: useDoubleDigits ? doubleDigits(0) : 0,
        seconds: useDoubleDigits ? doubleDigits(0) : 0,
      },
      countdownCompleted: true,
    }
  }
}

/**
 * Converts number to double digits. Doesn't work for numbers > 99
 * @param {number} num
 * @returns {string}
 */
const doubleDigits = (num: number) => ('0' + num).slice(-2)
