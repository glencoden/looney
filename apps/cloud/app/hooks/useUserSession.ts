import { api } from '@repo/api/client'
import { useEffectEvent } from '@repo/utils/hooks'
import { Session } from '@supabase/supabase-js'
import { skipToken } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '~/lib/supabase.client'

export const useUserSession = () => {
    const [session, setSession] = useState<Session | null>()
    const [isSessionLoading, setIsSessionLoading] = useState(true)

    const handleMount = useEffectEvent(async () => {
        const { data } = await supabase.auth.getSession()
        setSession(data?.session)
        setIsSessionLoading(false)
    })

    useEffect(() => {
        void handleMount()
    }, [handleMount])

    const { data: accessRole, isLoading: isAccessRoleLoading } =
        api.permission.get.useQuery(
            session?.user.email ? { email: session.user.email } : skipToken,
        )

    return useMemo(() => {
        const notLoaded = session === undefined || accessRole === undefined
        const noSession = session === null

        return {
            userSession:
                notLoaded || noSession
                    ? null
                    : {
                          ...session,
                          user: {
                              ...session.user,
                              accessRole,
                          },
                      },
            isUserSessionLoading: isSessionLoading || isAccessRoleLoading,
        }
    }, [session, isSessionLoading, accessRole, isAccessRoleLoading])
}
