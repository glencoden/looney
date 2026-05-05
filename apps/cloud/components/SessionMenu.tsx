'use client'

import { Session } from '@repo/db'
import Button from '@repo/ui/components/Button'
import Spinner from '@repo/ui/components/Spinner'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { useSessionCountdown } from '@repo/utils/hooks'
import { House, Power, Trash } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import {
    closeSessionAction,
    deleteSessionAction,
} from '~/app/(authenticated)/session/actions'
import AddDemoLipButton from '~/components/AddDemoLipButton'

export default function SessionMenu({
    session,
    isSessionPending,
}: Readonly<{
    session: Session
    isSessionPending: boolean
}>) {
    const [isMenuPending, startMenuTransition] = useTransition()
    const countdown = useSessionCountdown(session.startsAt)

    const isPending = isSessionPending || isMenuPending

    return (
        <div className='flex justify-between'>
            <section className='flex items-center gap-4'>
                {countdown && <Subtitle2>Start in {countdown}</Subtitle2>}
                <AddDemoLipButton session={session} />
            </section>

            <section className='flex items-center gap-4'>
                {isPending && (
                    <div className='pr-2'>
                        <Spinner light />
                    </div>
                )}

                <form
                    action={() => {
                        startMenuTransition(() =>
                            countdown
                                ? deleteSessionAction(session.id)
                                : closeSessionAction(session.id),
                        )
                    }}
                    className='flex items-center'
                    onSubmit={(event) => {
                        const ok = confirm(
                            countdown
                                ? `Please confirm you want to delete "${session.title}".`
                                : `Please confirm you want to close "${session.title}".`,
                        )
                        if (!ok) event.preventDefault()
                    }}
                >
                    <Button
                        variant='ghost'
                        size='icon'
                        type='submit'
                        disabled={isPending}
                    >
                        {countdown ? (
                            <Trash className='h-6 w-6 text-white' />
                        ) : (
                            <Power className='h-6 w-6 text-white' />
                        )}
                    </Button>
                </form>

                <Button asChild variant='ghost' size='icon'>
                    <Link href='/'>
                        <House className='h-6 w-6 text-white' />
                    </Link>
                </Button>
            </section>
        </div>
    )
}
