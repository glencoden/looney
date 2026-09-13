'use client'

import Button from '@repo/ui/components/Button'
import { useRouter } from 'next/navigation'
import { authClient } from '~/lib/auth-client'
import { handleBeforeUnload } from '~/lib/handle-before-unload'

export function LogoutButton() {
    const router = useRouter()

    const signOut = async () => {
        await authClient.signOut()
        window.removeEventListener('beforeunload', handleBeforeUnload)
        router.push('/signin')
    }

    return (
        <Button
            variant='secondary'
            onClick={() => {
                void signOut()
            }}
        >
            Logout
        </Button>
    )
}
