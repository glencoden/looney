import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import logoWhite from '~/images/logo-white.png'
import { supabase } from '~/lib/supabase.client'

export default function Signin() {
    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <img src={logoWhite} alt='Logo' className='w-40' />
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
