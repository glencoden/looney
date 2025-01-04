import { api } from '@repo/api/client'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { supabase } from '~/lib/supabase.client'

export const useSession = () => {
    const { data: session, isLoading: isSessionLoading } = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const { data } = await supabase.auth.getSession()
            return data?.session
        },
    })

    const { data: accessRole, isLoading: isAccessRoleLoading } =
        api.permission.get.useQuery(
            session?.user.email ? { email: session.user.email } : skipToken,
        )

    return useMemo(() => {
        const notLoaded = session === undefined || accessRole === undefined
        const noSession = session === null

        return {
            session:
                notLoaded || noSession
                    ? null
                    : {
                          ...session,
                          user: {
                              ...session.user,
                              accessRole,
                          },
                      },
            isSessionLoading: isSessionLoading || isAccessRoleLoading,
        }
    }, [session, isSessionLoading, accessRole, isAccessRoleLoading])
}
