import { useEffect, useRef, useState } from 'react'

export const useThrottle = <T>(value: T, delay: number): T => {
    const [throttledValue, setThrottledValue] = useState<T>(value)

    const lastRun = useRef<number>(Date.now())

    useEffect(() => {
        const now = Date.now()
        const timeSinceLastRun = now - lastRun.current

        if (timeSinceLastRun >= delay) {
            setThrottledValue(value)
            lastRun.current = now
            return
        }

        const timeoutId = setTimeout(() => {
            setThrottledValue(value)
            lastRun.current = Date.now()
        }, delay - timeSinceLastRun)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [value, delay])

    return throttledValue
}
