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
      }
    | {
          type: 'lyrics'
          songId: Song['id']
      }

export const useAutoScreen = (): Response => {
    const utils = api.useUtils()

    const { data: session } = api.session.getCurrent.useQuery()

    const { data: liveLip } = api.lip.getLiveBySessionId.useQuery(
        session ? { id: session.id } : skipToken,
        {
            refetchInterval: 1000 * 10,
        },
    )

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
                    void utils.session.getCurrent.invalidate()
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
                    void utils.lip.getLiveBySessionId.invalidate({
                        id: session.id,
                    })
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
        return {
            type: 'home',
            sessionTitle: session!.title,
        }
    }, [isSessionActive, liveLip?.id])
}
