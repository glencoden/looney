import { useCallback, useEffect, useRef, useState } from 'react'

const SONG_TIMER_TIMEOUT = 1000 * 60 * 3
const HOME_TIMER_TIMEOUT = 1000 * 10

export const useHomeScreenTimer = (
    selectedSongId: string | null,
): {
    callHomeScreenTimer: () => void
    showHomeScreenByTimer: boolean
} => {
    const [showHomeScreen, setShowHomeScreen] = useState(false)

    const songTimerRef = useRef<ReturnType<typeof setTimeout>>()
    const homeTimerRef = useRef<ReturnType<typeof setTimeout>>()

    const clearAllTimers = useCallback(() => {
        clearTimeout(songTimerRef.current)
        clearTimeout(homeTimerRef.current)
        songTimerRef.current = undefined
        homeTimerRef.current = undefined
    }, [])

    useEffect(() => {
        return () => {
            clearAllTimers()
        }
    }, [clearAllTimers])

    useEffect(() => {
        setShowHomeScreen(false)
        clearAllTimers()
    }, [clearAllTimers, selectedSongId])

    const startHomeTimer = useCallback(() => {
        clearTimeout(homeTimerRef.current)
        homeTimerRef.current = setTimeout(() => {
            setShowHomeScreen(true)
        }, HOME_TIMER_TIMEOUT)
    }, [])

    const callHomeScreenTimer = useCallback(() => {
        setShowHomeScreen(false)

        if (homeTimerRef.current) {
            startHomeTimer()
            return
        }
        if (songTimerRef.current) {
            return
        }
        songTimerRef.current = setTimeout(startHomeTimer, SONG_TIMER_TIMEOUT)
    }, [startHomeTimer])

    return {
        callHomeScreenTimer,
        showHomeScreenByTimer: showHomeScreen,
    }
}
