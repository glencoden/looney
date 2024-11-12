import { useNavigate } from '@remix-run/react'
import Button from '@repo/ui/Button'
import { supabase } from '~/lib/supabase.client'

export default function Signout() {
    const navigate = useNavigate()

    const logout = async () => {
        await supabase.auth.signOut()
        navigate('/signin')
    }

    return (
        <div className='flex min-h-dvh flex-col items-center justify-center'>
            <Button
                onClick={() => {
                    void logout()
                }}
            >
                logout
            </Button>
        </div>
    )
}
