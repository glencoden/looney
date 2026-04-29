'use client'

import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import { useEffect, useRef } from 'react'

export const useLips = (sessionId: Session['id']) => {
    const utils = api.useUtils()

    const { data: digest } = api.lip.getSessionDigest.useQuery(
        { id: sessionId },
        { refetchInterval: 3000 },
    )

    const prevDigestRef = useRef(digest)

    useEffect(() => {
        const prev = prevDigestRef.current
        prevDigestRef.current = digest

        if (!prev || !digest) return

        const hasChanged =
            prev.count !== digest.count ||
            prev.lastUpdatedAt?.getTime() !== digest.lastUpdatedAt?.getTime()

        if (hasChanged) {
            void utils.lip.getBySessionId.invalidate({ id: sessionId })
        }
    }, [digest, utils, sessionId])

    return api.lip.getBySessionId.useQuery({ id: sessionId })
}
