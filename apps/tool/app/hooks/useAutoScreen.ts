import { api } from '@repo/api/client'
import { Session, Song } from '@repo/db'
import { skipToken } from '@tanstack/react-query'
import { useMemo } from 'react'

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
          sessionTitle: Session['title']
          songId: Song['id']
      }

export const useAutoScreen = ({
    isDisabled,
}: {
    isDisabled?: boolean
}): Response => {
    const { data: session } = api.session.getCurrent.useQuery(undefined, {
        refetchInterval: 1000,
    })

    const { data: liveLip } = api.lip.getLiveBySessionId.useQuery(
        session ? { id: session.id } : skipToken,
        {
            refetchInterval: 1000,
        },
    )

    const isSessionActive =
        Boolean(session) && !session!.isLocked && session!.endsAt > new Date()

    return useMemo(() => {
        if (!isSessionActive || isDisabled) {
            return {
                type: 'idle',
            }
        }
        if (!liveLip) {
            return {
                type: 'home',
                sessionTitle: session!.title,
            }
        }
        return {
            type: 'lyrics',
            sessionTitle: session!.title,
            songId: liveLip.songId,
        }
    }, [isDisabled, isSessionActive, liveLip, session])
}
