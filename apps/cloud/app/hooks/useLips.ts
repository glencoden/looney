import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import { useEffect } from 'react'
import { supabase } from '~/lib/supabase.client'

export const useLips = (sessionId: Session['id']) => {
    const utils = api.useUtils()

    useEffect(() => {
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
                    void utils.lip.getBySessionId.invalidate({ id: sessionId })
                },
            )
            .subscribe()
        return () => {
            void supabase.removeChannel(channel)
        }
    }, [utils, sessionId])

    return api.lip.getBySessionId.useQuery({ id: sessionId })
}
