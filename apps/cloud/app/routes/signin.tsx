import Button from '@repo/ui/Button'
import { supabase } from '~/lib/supabase.client'

export default function Signin() {
    return (
        <Button
            onClick={() => {
                void supabase.auth.signInWithOAuth({
                    provider: 'google',
                })
            }}
        >
            login
        </Button>
    )
}
