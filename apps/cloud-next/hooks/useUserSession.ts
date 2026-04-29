'use client'

import { use } from 'react'
import { UserSessionContext } from '~/components/UserSessionProvider'

export const useUserSession = () => {
    const userSession = use(UserSessionContext)
    if (!userSession) {
        throw new Error(
            'useUserSession must be used within UserSessionProvider',
        )
    }
    return userSession
}
