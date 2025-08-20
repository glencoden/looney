import { Link, useNavigation } from 'react-router'
import { api } from '@repo/api/client'
import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Logo from '@repo/ui/components/Logo'
import { ExternalLink, LogOut } from 'lucide-react'
import { hasAccess } from '~/helpers/has-access'
import { useUserSession } from '~/hooks/useUserSession'

export default function Index() {
    const navigation = useNavigation()

    const { userSession } = useUserSession()
    const accessRole = userSession?.user.accessRole

    const { data: currentSession } = api.session.getCurrent.useQuery()
    const { data: upcomingSession } = api.session.getUpcoming.useQuery()

    const session = currentSession ?? upcomingSession

    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <Button
                    asChild
                    className='float-end'
                    variant='ghost'
                    size='icon'
                    disabled={navigation.state === 'loading'}
                >
                    <Link to='/signout'>
                        <LogOut className='h-6 w-6 text-white' />
                    </Link>
                </Button>

                <Logo />
            </header>

            <BoxContentSlot>
                <nav>
                    <ul className='flex w-full max-w-96 flex-grow flex-col items-center justify-center gap-4'>
                        {hasAccess(accessRole, 'host') && (
                            <li className='w-full'>
                                <Button
                                    variant='secondary'
                                    asChild
                                    loading={
                                        navigation.state === 'loading' &&
                                        navigation.location.pathname ===
                                            '/songs'
                                    }
                                >
                                    <Link to='/songs'>Songs</Link>
                                </Button>
                            </li>
                        )}
                        {hasAccess(accessRole, 'host') && (
                            <li className='w-full'>
                                <Button
                                    variant='secondary'
                                    asChild
                                    loading={
                                        navigation.state === 'loading' &&
                                        navigation.location.pathname ===
                                            '/setlists'
                                    }
                                >
                                    <Link to='/setlists'>Setlists</Link>
                                </Button>
                            </li>
                        )}

                        <li className='w-full'>
                            <Button
                                variant='secondary'
                                asChild
                                loading={
                                    navigation.state === 'loading' &&
                                    navigation.location.pathname === '/insights'
                                }
                            >
                                <Link to='/insights'>Insights</Link>
                            </Button>
                        </li>

                        <hr className='w-full border-2 border-transparent' />

                        {/* {hasAccess(accessRole, 'host') && (
                            <li className='w-full'>
                                <Button variant='light' asChild>
                                    <Link to='/'>
                                        Content{' '}
                                        <ExternalLink className='ml-2 h-5 w-5' />
                                    </Link>
                                </Button>
                            </li>
                        )} */}
                        <li className='w-full'>
                            <Button variant='light' asChild>
                                <Link
                                    to='http://tool.looneytunez.de'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                >
                                    Tool&nbsp;
                                    <ExternalLink className='ml-2 h-5 w-5' />
                                </Link>
                            </Button>
                        </li>
                        <li className='w-full'>
                            <Button variant='light' asChild>
                                <Link
                                    to='https://sing.looneytunez.de'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                >
                                    Sing&nbsp;
                                    <ExternalLink className='ml-2 h-5 w-5' />
                                </Link>
                            </Button>
                        </li>

                        <hr className='w-full border-2 border-transparent' />

                        <li className='w-full'>
                            <Button
                                asChild
                                loading={
                                    navigation.state === 'loading' &&
                                    navigation.location.pathname.startsWith(
                                        '/session',
                                    )
                                }
                            >
                                <Link
                                    to={
                                        session
                                            ? `/session/${session.id}`
                                            : '/session'
                                    }
                                >
                                    Session
                                </Link>
                            </Button>
                        </li>
                    </ul>
                </nav>
            </BoxContentSlot>
        </BoxMain>
    )
}
