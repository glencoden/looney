import Button from '@repo/ui/Button'
import { supabase } from '~/lib/supabase.client'

export default function Signin() {
    return (
        <div className='flex min-h-dvh flex-col items-center justify-center'>
            <Button
                onClick={() => {
                    void supabase.auth.signInWithOAuth({
                        provider: 'google',
                    })
                }}
            >
                login
            </Button>
        </div>
    )
}
