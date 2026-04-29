'use client'

import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Logo from '@repo/ui/components/Logo'
import { api } from '@repo/api/client'
import { ExternalLink, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { hasAccess } from '~/lib/has-access'
import { useUserSession } from '~/hooks/useUserSession'

export default function HomePage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const { user } = useUserSession()
    const accessRole = user.accessRole

    const { data: currentSession } = api.session.getCurrent.useQuery()
    const { data: upcomingSession } = api.session.getUpcoming.useQuery()

    const session = currentSession ?? upcomingSession

    const navigateTo = (href: string) => () =>
        startTransition(() => router.push(href))

    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <Button
                    asChild
                    className='float-end'
                    variant='ghost'
                    size='icon'
                    disabled={isPending}
                >
                    <Link href='/signout'>
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
                                    onClick={navigateTo('/songs')}
                                >
                                    Songs
                                </Button>
                            </li>
                        )}
                        {hasAccess(accessRole, 'host') && (
                            <li className='w-full'>
                                <Button
                                    variant='secondary'
                                    onClick={navigateTo('/setlists')}
                                >
                                    Setlists
                                </Button>
                            </li>
                        )}

                        <li className='w-full'>
                            <Button
                                variant='secondary'
                                onClick={navigateTo('/insights')}
                            >
                                Insights
                            </Button>
                        </li>

                        <hr className='w-full border-2 border-transparent' />

                        <li className='w-full'>
                            <Button variant='light' asChild>
                                <a
                                    href='http://tool.looneytunez.de'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                >
                                    Tool&nbsp;
                                    <ExternalLink className='ml-2 h-5 w-5' />
                                </a>
                            </Button>
                        </li>
                        <li className='w-full'>
                            <Button variant='light' asChild>
                                <a
                                    href='https://sing.looneytunez.de'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                >
                                    Sing&nbsp;
                                    <ExternalLink className='ml-2 h-5 w-5' />
                                </a>
                            </Button>
                        </li>

                        <hr className='w-full border-2 border-transparent' />

                        <li className='w-full'>
                            <Button
                                onClick={navigateTo(
                                    session ? `/session/${session.id}` : '/session',
                                )}
                            >
                                Session
                            </Button>
                        </li>
                    </ul>
                </nav>
            </BoxContentSlot>
        </BoxMain>
    )
}
