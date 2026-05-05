import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Logo from '@repo/ui/components/Logo'
import { ExternalLink, LogOut } from 'lucide-react'
import Link from 'next/link'
import { SessionLinkButton } from './SessionLinkButton'

export default function HomePage() {
    return (
        <BoxMain className='flex flex-col items-center'>
            <header className='w-full'>
                <Button
                    asChild
                    className='float-end'
                    variant='ghost'
                    size='icon'
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
                        <li className='w-full'>
                            <Button variant='secondary' asChild>
                                <Link href='/songs'>Songs</Link>
                            </Button>
                        </li>
                        <li className='w-full'>
                            <Button variant='secondary' asChild>
                                <Link href='/setlists'>Setlists</Link>
                            </Button>
                        </li>

                        <li className='w-full'>
                            <Button variant='secondary' asChild>
                                <Link href='/insights'>Insights</Link>
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
                            <SessionLinkButton />
                        </li>
                    </ul>
                </nav>
            </BoxContentSlot>
        </BoxMain>
    )
}
