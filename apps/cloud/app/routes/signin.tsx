import BoxContent from '@repo/ui/components/BoxContent'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import H1 from '@repo/ui/typography/H1'
import { supabase } from '~/lib/supabase.client'

export default function Signin() {
    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <H1 secondary className='mt-20'>
                    Looney Cloud
                </H1>
            </header>

            <BoxContent>
                <nav>
                    <Button
                        onClick={() => {
                            void supabase.auth.signInWithOAuth({
                                provider: 'google',
                            })
                        }}
                    >
                        Login
                    </Button>
                </nav>
            </BoxContent>
        </BoxMain>
    )
}
