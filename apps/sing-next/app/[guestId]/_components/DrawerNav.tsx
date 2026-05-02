'use client'

import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DrawerNav({ guestId }: { guestId: string }) {
    const pathname = usePathname()
    const t = useTranslations()

    const root = `/${guestId}`
    const songsHref = `${root}/songs`
    const feedbackHref = `${root}/feedback`

    const onSongs = pathname === songsHref
    const onFeedback = pathname === feedbackHref

    return (
        <>
            <div className='absolute inset-x-0 bottom-0 h-1 bg-black' />
            <div className='absolute inset-x-0 bottom-1 h-24 rounded-t-2xl bg-black' />
            <nav className='pointer-events-auto absolute bottom-0 left-1 right-1 z-20 grid h-24 grid-cols-2 place-items-center rounded-t-[13px] bg-blue-800'>
                <Button
                    asChild
                    size='sm'
                    className={cn('px-1', { 'text-white': onSongs })}
                >
                    <Link href={onSongs ? root : songsHref}>
                        {t('nav.button.songs')}
                    </Link>
                </Button>
                <Button
                    asChild
                    size='sm'
                    className={cn('px-1', { 'text-white': onFeedback })}
                >
                    <Link href={onFeedback ? root : feedbackHref}>
                        {t('nav.button.feedback')}
                    </Link>
                </Button>
            </nav>
        </>
    )
}
