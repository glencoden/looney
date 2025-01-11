import { Link, useNavigate } from '@remix-run/react'
import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import { handleBeforeUnload } from '~/helpers/handle-before-unload'
import logoWhite from '~/images/logo-white.png'
import { supabase } from '~/lib/supabase.client'

export default function Signout() {
    const navigate = useNavigate()

    const logout = async () => {
        await supabase.auth.signOut()
        window.removeEventListener('beforeunload', handleBeforeUnload)
        navigate('/signin')
    }

    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <img src={logoWhite} alt='Logo' className='w-40' />
            </header>

            <BoxContentSlot>
                <nav className='space-y-6'>
                    <Button
                        variant='secondary'
                        onClick={() => {
                            void logout()
                        }}
                    >
                        Logout
                    </Button>

                    <Button asChild>
                        <Link to='/'>Back to Home</Link>
                    </Button>
                </nav>
            </BoxContentSlot>
        </BoxMain>
    )
}
