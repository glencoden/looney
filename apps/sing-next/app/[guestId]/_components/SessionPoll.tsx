'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const POLL_INTERVAL = 1000 * 60

export function SessionPoll() {
    const router = useRouter()

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (document.visibilityState !== 'visible') return
            router.refresh()
        }, POLL_INTERVAL)

        return () => {
            clearInterval(intervalId)
        }
    }, [router])

    return null
}
