import { Session } from '@repo/db'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { useEffect, useState } from 'react'

const DAY_IN_MS = 1000 * 60 * 60 * 24
const HOUR_IN_MS = 1000 * 60 * 60
const MINUTE_IN_MS = 1000 * 60
const SECOND_IN_MS = 1000

export default function SessionCountdown({
    startsAt,
}: {
    startsAt: Session['startsAt']
}) {
    const [countdown, setCountdown] = useState<string | null>(null)

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | undefined = undefined

        const startInterval = () => {
            intervalId = setInterval(() => {
                const now = new Date()
                const diff = startsAt.getTime() - now.getTime()
                const days = Math.floor(diff / DAY_IN_MS)
                const hours = Math.floor((diff % DAY_IN_MS) / HOUR_IN_MS)
                const minutes = Math.floor((diff % HOUR_IN_MS) / MINUTE_IN_MS)
                const seconds = Math.floor((diff % MINUTE_IN_MS) / SECOND_IN_MS)

                if (days + hours + minutes + seconds < 0) {
                    clearInterval(intervalId)
                    setCountdown(null)
                    return
                }

                setCountdown(
                    `${days > 0 ? `${days} days and ` : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                )
            }, 1000)
        }

        startInterval()

        return () => clearInterval(intervalId)
    }, [startsAt])

    if (countdown === null) {
        return null
    }

    return <Subtitle2>{countdown}</Subtitle2>
}
