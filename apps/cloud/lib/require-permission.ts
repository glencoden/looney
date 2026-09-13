import 'server-only'
import { hasPermission, type PermissionRole } from '@repo/db'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'

export async function requirePermission(role: PermissionRole) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect('/signin')
    }

    if (!hasPermission(session.user.permissionRole, role)) {
        redirect(`/unauthorized?required=${role}`)
    }

    return session.user
}
