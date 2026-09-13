import { isPermissionRole } from '@repo/db/permission'
import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Logo from '@repo/ui/components/Logo'
import Body1 from '@repo/ui/typography/Body1'
import { headers } from 'next/headers'
import Link from 'next/link'
import { LogoutButton } from '~/components/LogoutButton'
import { auth } from '~/lib/auth'

export default async function UnauthorizedPage({
    searchParams,
}: {
    searchParams: Promise<{ required?: string }>
}) {
    const { required } = await searchParams
    const session = await auth.api.getSession({ headers: await headers() })
    const role = session?.user.permissionRole ?? 'user'
    const requiredRole = isPermissionRole(required) ? required : null

    const message = requiredRole
        ? `Your role '${role}' does not have permission for this action. It requires the '${requiredRole}' role.`
        : `Your role '${role}' does not have permission to use this app. Ask an admin to assign you a role.`

    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <Logo />
            </header>

            <BoxContentSlot>
                <div className='space-y-6'>
                    <Body1>{message}</Body1>

                    <nav className='space-y-6'>
                        {requiredRole && (
                            <Button asChild>
                                <Link href='/'>Back to Home</Link>
                            </Button>
                        )}
                        <LogoutButton />
                    </nav>
                </div>
            </BoxContentSlot>
        </BoxMain>
    )
}
