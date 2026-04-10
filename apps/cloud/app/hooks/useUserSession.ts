import { api } from '@repo/api/client'
import { skipToken } from '@tanstack/react-query'
import { useMemo } from 'react'
import { authClient } from '~/lib/auth.client'

export const useUserSession = () => {
    const { data: session, isPending: isSessionLoading } =
        authClient.useSession()

    const { data: accessRole, isLoading: isAccessRoleLoading } =
        api.permission.get.useQuery(
            session?.user.email
                ? { email: session.user.email }
                : skipToken,
        )

    return useMemo(() => {
        const notLoaded = isSessionLoading || accessRole === undefined
        const noSession = !session

        return {
            userSession:
                notLoaded || noSession
                    ? null
                    : {
                          user: {
                              ...session.user,
                              accessRole,
                          },
                          expiresAt: new Date(session.session.expiresAt),
                      },
            isUserSessionLoading: isSessionLoading || isAccessRoleLoading,
        }
    }, [session, isSessionLoading, accessRole, isAccessRoleLoading])
}
