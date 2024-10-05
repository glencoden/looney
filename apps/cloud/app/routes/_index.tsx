import { Link, useNavigation } from '@remix-run/react'
import Button from '@repo/ui/Button'

export default function Index() {
    const { state } = useNavigation()

    return (
        <div className='px-main py-main container flex min-h-dvh flex-col items-center'>
            <header>Header</header>

            <nav className='flex w-96 flex-grow flex-col items-center justify-center gap-4'>
                <ul>
                    <li>
                        <Button asChild loading={state === 'loading'}>
                            <Link to='/songs'>Songs</Link>
                        </Button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
