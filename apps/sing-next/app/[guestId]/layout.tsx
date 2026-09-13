import { getGuest, getSession } from '@repo/db/queries'
import { Suspense, type ReactNode } from 'react'
import { WaitingScreen } from '../_components/WaitingScreen'
import { Countdown } from './_components/Countdown'
import { DrawerNav } from './_components/DrawerNav'
import { DrawerShell } from './_components/DrawerShell'
import { SessionPoll } from './_components/SessionPoll'

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

    const session = guest?.sessionId ? await getSession(guest.sessionId) : null

    if (!session || session.endsAt < new Date()) {
        return <WaitingScreen />
    }

    if (session.startsAt > new Date()) {
        return <Countdown startsAt={session.startsAt} />
    }

    return (
        <>
            {children}
            <SessionPoll />
            <section className='absolute inset-x-0 bottom-0 h-24'>
                <Suspense>
                    <DrawerNav guestId={guestId} />
                </Suspense>
            </section>
            <Suspense>
                <DrawerShell guestId={guestId}>{drawer}</DrawerShell>
            </Suspense>
        </>
    )
}
