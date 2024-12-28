import { Link, useNavigation } from '@remix-run/react'
import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import H1 from '@repo/ui/typography/H1'
import { ExternalLink, LogOut } from 'lucide-react'

export default function Index() {
    const navigation = useNavigation()

    return (
        <BoxMain className='flex flex-col items-center'>
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

                <H1 className='mt-20'>Looney Cloud</H1>
            </header>

            <BoxContentSlot>
                <nav>
                    <ul className='flex w-full max-w-96 flex-grow flex-col items-center justify-center gap-4'>
                        <li className='w-full'>
                            <Button
                                variant='secondary'
                                asChild
                                loading={
                                    navigation.state === 'loading' &&
                                    navigation.location.pathname === '/songs'
                                }
                            >
                                <Link to='/songs'>Songs</Link>
                            </Button>
                        </li>
                        <li className='w-full'>
                            <Button
                                variant='secondary'
                                asChild
                                loading={
                                    navigation.state === 'loading' &&
                                    navigation.location.pathname === '/setlists'
                                }
                            >
                                <Link to='/'>Setlists</Link>
                            </Button>
                        </li>
                        <li className='w-full'>
                            <Button
                                variant='secondary'
                                asChild
                                loading={
                                    navigation.state === 'loading' &&
                                    navigation.location.pathname === '/insights'
                                }
                            >
                                <Link to='/'>Insights</Link>
                            </Button>
                        </li>

                        <hr className='w-full border-2 border-transparent' />

                        <li className='w-full'>
                            <Button variant='light' asChild>
                                <Link to='/'>
                                    Content{' '}
                                    <ExternalLink className='ml-2 h-5 w-5' />
                                </Link>
                            </Button>
                        </li>
                        <li className='w-full'>
                            <Button variant='light' asChild>
                                <Link to='/'>
                                    Tool{' '}
                                    <ExternalLink className='ml-2 h-5 w-5' />
                                </Link>
                            </Button>
                        </li>
                        <li className='w-full'>
                            <Button variant='light' asChild>
                                <Link to='/'>Sing</Link>
                            </Button>
                        </li>

                        <hr className='w-full border-2 border-transparent' />

                        <li className='w-full'>
                            <Button
                                asChild
                                loading={
                                    navigation.state === 'loading' &&
                                    navigation.location.pathname === '/session'
                                }
                            >
                                <Link to='/session'>Session</Link>
                            </Button>
                        </li>
                    </ul>
                </nav>
            </BoxContentSlot>
        </BoxMain>
    )
}
