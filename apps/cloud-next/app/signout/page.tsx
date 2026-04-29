'use client'

import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Logo from '@repo/ui/components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '~/lib/auth-client'
import { handleBeforeUnload } from '~/lib/handle-before-unload'

export default function SignoutPage() {
    const router = useRouter()

    const signOut = async () => {
        await authClient.signOut()
        window.removeEventListener('beforeunload', handleBeforeUnload)
        router.push('/signin')
    }

    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <Logo />
            </header>

            <BoxContentSlot>
                <nav className='space-y-6'>
                    <Button
                        variant='secondary'
                        onClick={() => {
                            void signOut()
                        }}
                    >
                        Logout
                    </Button>

                    <Button asChild>
                        <Link href='/'>Back to Home</Link>
                    </Button>
                </nav>
            </BoxContentSlot>
        </BoxMain>
    )
}
