import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import { useEffect } from 'react'
import { supabase } from '~/lib/supabase.client'

export const useLips = (sessionId: Session['id']) => {
    const utils = api.useUtils()

    // Listen for lip insertions of the current session
    useEffect(() => {
        const channel = supabase
            .channel('lip')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'lip',
                    filter: `session_id=eq.${sessionId}`,
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
