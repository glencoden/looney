import { Link, useNavigation } from '@remix-run/react'
import Button from '@repo/ui/Button'

export default function Index() {
    const navigation = useNavigation()

    return (
        <div className='px-main py-main container flex min-h-dvh flex-col items-center'>
            <header>Looney Cloud</header>

            <nav className='flex w-full max-w-96 flex-grow flex-col items-center justify-center'>
                <ul className='flex w-full flex-grow flex-col items-center justify-center gap-4'>
                    <li className='w-full'>
                        <Button
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Events</Link>
                        </Button>
                    </li>
                    <li className='w-full'>
                        <Button
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Session</Link>
                        </Button>
                    </li>

                    <li className='w-full'>
                        <hr />
                    </li>

                    <li className='w-full'>
                        <Button
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Songs</Link>
                        </Button>
                    </li>
                    <li className='w-full'>
                        <Button
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Setlists</Link>
                        </Button>
                    </li>
                    <li className='w-full'>
                        <Button
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Stats</Link>
                        </Button>
                    </li>

                    <li className='w-full'>
                        <hr />
                    </li>

                    <li className='w-full'>
                        <Button
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Tool</Link>
                        </Button>
                    </li>
                    <li className='w-full'>
                        <Button
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Sing</Link>
                        </Button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
