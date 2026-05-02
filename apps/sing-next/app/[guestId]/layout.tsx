import { getGuest, getSession } from '@repo/db/queries'
import H2 from '@repo/ui/typography/H2'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Countdown } from './_components/Countdown'
import { DrawerNav } from './_components/DrawerNav'
import { DrawerShell } from './_components/DrawerShell'

export default async function GuestLayout({
    children,
    drawer,
    params,
}: {
    children: ReactNode
    drawer: ReactNode
    params: Promise<{ guestId: string }>
}) {
    const { guestId } = await params
    const guest = await getGuest(guestId)

    if (!guest) {
        notFound()
    }

    const session = guest.sessionId ? await getSession(guest.sessionId) : null
    const t = await getTranslations()

    if (!session || session.endsAt < new Date()) {
        return (
            <div className='mobile-sim-height flex items-center justify-center'>
                <H2>{t('root.waiting.headline')}</H2>
            </div>
        )
    }

    if (session.startsAt > new Date()) {
        return <Countdown startsAt={session.startsAt} />
    }

    return (
        <>
            {children}
            <section className='absolute inset-x-0 bottom-0 z-10 h-24'>
                <DrawerNav guestId={guestId} />
            </section>
            <DrawerShell guestId={guestId}>{drawer}</DrawerShell>
        </>
    )
}
