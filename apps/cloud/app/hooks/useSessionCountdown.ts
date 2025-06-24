import { Session } from '@repo/db'
import { useEffect, useState } from 'react'

const DAY_IN_MS = 1000 * 60 * 60 * 24
const HOUR_IN_MS = 1000 * 60 * 60
const MINUTE_IN_MS = 1000 * 60
const SECOND_IN_MS = 1000

const getCountdown = (startsAt: Session['startsAt']): string | null => {
    const now = new Date()
    const diff = startsAt.getTime() - now.getTime()
    const days = Math.floor(diff / DAY_IN_MS)
    const hours = Math.floor((diff % DAY_IN_MS) / HOUR_IN_MS)
    const minutes = Math.floor((diff % HOUR_IN_MS) / MINUTE_IN_MS)
    const seconds = Math.floor((diff % MINUTE_IN_MS) / SECOND_IN_MS)

    if (days + hours + minutes + seconds < 0) {
        return null
    }

    return `${days > 0 ? `${days} days and ` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const useSessionCountdown = (startsAt: Session['startsAt']) => {
    const [countdown, setCountdown] = useState<string | null>(
        getCountdown(startsAt),
    )

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | undefined = undefined

        const startInterval = () => {
            intervalId = setInterval(() => {
                const currentCountdown = getCountdown(startsAt)

                if (currentCountdown === null) {
                    clearInterval(intervalId)
                    setCountdown(null)
                    return
                }

                setCountdown(currentCountdown)
            }, 1000)
        }

        startInterval()

        return () => clearInterval(intervalId)
    }, [startsAt])

    if (countdown === null) {
        return null
    }

    return countdown
}
