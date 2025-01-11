import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Logo from '~/components/Logo'
import { supabase } from '~/lib/supabase.client'

export default function Signin() {
    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <Logo />
            </header>

            <BoxContentSlot>
                <nav>
                    <Button
                        onClick={() => {
                            void supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: import.meta.env
                                        .VITE_SUPABASE_REDIRECT_URL,
                                },
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
