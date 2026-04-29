'use client'

import type { Permission } from '@repo/db'
import { createContext, type ReactNode, useEffect } from 'react'
import { handleBeforeUnload } from '~/lib/handle-before-unload'

export type UserSession = {
    user: {
        id: string
        email: string
        name: string
        image: string | null
        accessRole: Permission['role']
    }
}

export const UserSessionContext = createContext<UserSession | null>(null)

export function UserSessionProvider({
    value,
    children,
}: {
    value: UserSession
    children: ReactNode
}) {
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])

    return (
        <UserSessionContext.Provider value={value}>
            {children}
        </UserSessionContext.Provider>
    )
}
