import { getPermission } from '@repo/db/queries'
import BoxMain from '@repo/ui/components/BoxMain'
import H1 from '@repo/ui/typography/H1'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { auth } from '~/lib/auth'
import { hasAccess } from '~/lib/has-access'
import {
    UserSessionProvider,
    type UserSession,
} from '~/components/UserSessionProvider'

export const dynamic = 'force-dynamic'

export default async function AuthenticatedLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) redirect('/signin')

    const [permission] = await getPermission(session.user.email)
    const accessRole = permission?.role

    if (accessRole === undefined || !hasAccess(accessRole)) {
        return (
            <BoxMain className='flex items-center justify-center'>
                <H1>Unauthorized</H1>
            </BoxMain>
        )
    }

    const userSession: UserSession = {
        user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image ?? null,
            accessRole,
        },
    }

    return (
        <UserSessionProvider value={userSession}>{children}</UserSessionProvider>
    )
}
