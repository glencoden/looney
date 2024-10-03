import type { MetaFunction } from '@remix-run/node'
import { Link, NavLink } from '@remix-run/react'
import { api } from '@repo/api/client'
import Button from '@repo/ui/Button'
import { supabase } from '~/lib/supabase.client'

export const meta: MetaFunction = () => {
    return [
        { title: 'Looney Cloud' },
        { name: 'description', content: 'Console for Looneytunez cloud.' },
    ]
}

export default function Index() {
    const { data: setlists } = api.setlist.get.useQuery()

    console.log('setlists', setlists)

    return (
        <main className='flex h-screen items-center justify-center'>
            <header className='flex flex-col items-center gap-9'>
                <Button
                    onClick={() => {
                        void supabase.auth.signInWithOAuth({
                            provider: 'google',
                        })
                    }}
                >
                    login
                </Button>
                <Link to='/logout'>logout</Link>
            </header>
            <nav className='flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700'>
                <NavLink to='/setlist'>Setlists</NavLink>
            </nav>
        </main>
    )
}
