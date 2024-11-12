import { Link, useNavigation } from '@remix-run/react'
import Button from '@repo/ui/Button'
import { ExternalLink, LogOut } from 'lucide-react'

export default function Index() {
    const navigation = useNavigation()

    return (
        <div className='px-main py-main container flex min-h-dvh flex-col items-center border-l-4 border-r-4 border-white'>
            <header className='w-full'>
                <Button
                    asChild
                    className='float-end'
                    variant='ghost'
                    size='icon'
                    loading={navigation.state === 'loading'}
                >
                    <Link to='/signout'>
                        <LogOut className='h-6 w-6 text-white' />
                    </Link>
                </Button>

                <h1 className='font-display mt-12 text-center text-[54px] font-bold text-white'>
                    Looney Cloud
                </h1>
            </header>

            <nav className='flex w-full max-w-96 flex-grow flex-col items-center justify-center'>
                <ul className='flex w-full flex-grow flex-col items-center justify-center gap-4'>
                    <li className='w-full'>
                        <Button
                            variant='secondary'
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Songs</Link>
                        </Button>
                    </li>
                    <li className='w-full'>
                        <Button
                            variant='secondary'
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Setlists</Link>
                        </Button>
                    </li>
                    <li className='w-full'>
                        <Button
                            variant='secondary'
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Stats</Link>
                        </Button>
                    </li>

                    <hr className='w-full border-2 border-transparent' />

                    <li className='w-full'>
                        <Button
                            variant='light'
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>
                                Tool <ExternalLink className='ml-2 h-5 w-5' />
                            </Link>
                        </Button>
                    </li>
                    <li className='w-full'>
                        <Button
                            variant='light'
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>
                                Sing <ExternalLink className='ml-2 h-5 w-5' />
                            </Link>
                        </Button>
                    </li>

                    <hr className='w-full border-2 border-transparent' />

                    <li className='w-full'>
                        <Button
                            asChild
                            loading={navigation.state === 'loading'}
                        >
                            <Link to='/songs'>Session</Link>
                        </Button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
