import { LipDTO } from '@repo/api'
import { api } from '@repo/api/client'
import { Song } from '@repo/db'
import { skipToken } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '~/lib/supabase.client'

type Response =
    | {
          type: 'idle'
      }
    | {
          type: 'home'
      }
    | {
          type: 'call'
          prevLip: LipDTO | null
          nextLip: LipDTO
      }
    | {
          type: 'lyrics'
          songId: Song['id']
      }

export const useAutoScreen = (): Response => {
    const utils = api.useUtils()

    const { data: session } = api.session.getCurrent.useQuery({
        includeDemo: true,
    })

    const { data: lips } = api.lip.getBySessionId.useQuery(
        session ? { id: session.id } : skipToken,
    )

    const stagedLip = lips?.find((lip) => lip.status === 'staged') ?? null
    const liveLip = lips?.find((lip) => lip.status === 'live') ?? null
    const doneLip = lips?.find((lip) => lip.status === 'done') ?? null

    const [isSessionActive, setIsSessionActive] = useState(false)

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>

        const checkSession = () => {
            setIsSessionActive(
                Boolean(session) &&
                    !session!.isLocked &&
                    session!.endsAt > new Date(),
            )
            return setTimeout(() => {
                timeoutId = checkSession()
            }, 1000 * 10)
        }

        timeoutId = checkSession()

        return () => {
            clearTimeout(timeoutId)
        }
    }, [session])

    useEffect(() => {
        const channel = supabase
            .channel('session')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'session',
                },
                () => {
                    void utils.session.getCurrent.invalidate({
                        includeDemo: true,
                    })
                },
            )
            .subscribe()

        return () => {
            void supabase.removeChannel(channel)
        }
    }, [utils])

    useEffect(() => {
        if (!session?.id) {
            return
        }

        const channel = supabase
            .channel('session')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'lip',
                },
                () => {
                    void utils.lip.getBySessionId.invalidate({ id: session.id })
                },
            )
            .subscribe()

        return () => {
            void supabase.removeChannel(channel)
        }
    }, [utils, session?.id])

    return useMemo(() => {
        if (!isSessionActive) {
            return {
                type: 'idle',
            }
        }
        if (liveLip) {
            return {
                type: 'lyrics',
                songId: liveLip.songId,
            }
        }
        if (stagedLip) {
            return {
                type: 'call',
                prevLip: doneLip,
                nextLip: stagedLip,
            }
        }
        return {
            type: 'home',
        }
    }, [isSessionActive, stagedLip?.id, liveLip?.id, doneLip?.id])
}
