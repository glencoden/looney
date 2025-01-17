import { LipDTO } from '@repo/api'
import { api } from '@repo/api/client'
import { Session, Song } from '@repo/db'
import { skipToken } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { supabase } from '~/lib/supabase.client'

type Response =
    | {
          type: 'idle'
      }
    | {
          type: 'home'
          sessionTitle: Session['title']
          isDemo: boolean
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

    const isSessionActive =
        Boolean(session) && !session!.isLocked && session!.endsAt > new Date()

    useEffect(() => {
        const channel = supabase
            .channel('session')
            .on(
                'postgres_changes',
                {
                    event: '*',
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
            .channel('lip')
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
            sessionTitle: session!.title,
            isDemo: session!.isDemo ?? false,
        }
    }, [
        isSessionActive,
        session?.isDemo,
        stagedLip?.id,
        liveLip?.id,
        doneLip?.id,
    ])
}
