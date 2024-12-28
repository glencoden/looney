import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import H1 from '@repo/ui/typography/H1'
import { supabase } from '~/lib/supabase.client'

export default function Signin() {
    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <H1 className='mt-20'>Looney Cloud</H1>
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
