'use client'

import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Logo from '@repo/ui/components/Logo'
import { authClient } from '~/lib/auth-client'

export default function SigninPage() {
    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <Logo />
            </header>

            <BoxContentSlot>
                <nav>
                    <Button
                        onClick={() => {
                            void authClient.signIn.social({
                                provider: 'google',
                                callbackURL: '/',
                            })
                        }}
                    >
                        Login
                    </Button>
                </nav>
            </BoxContentSlot>
        </BoxMain>
    )
}
