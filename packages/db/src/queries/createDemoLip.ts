import { and, eq } from 'drizzle-orm'
import { db, guestsTable, lipsTable, Session, songsTable } from '../index.js'

const DEMO_GUEST_NAMES = [
    'Ulf Meyer',
    'Gabi Lichtenstein',
    'Rolf Bärwald',
    'Petra Schmidt',
    'Roland Zaunhofer',
    'Anne-Liese Fink',
    'Bernd Müller',
    'Roland Zaunhofer',
    'Anne-Liese Fink',
    'Bernd Müller',
    'Charly Brown',
    'Lotte Schneider',
    'Julia Dirksen',
]

export const createDemoLip = (sessionId: Session['id']) => {
    return db.transaction(async (tx) => {
        const songs = await tx.select().from(songsTable)

        const demoSong = songs[Math.floor(Math.random() * songs.length)]

        if (!demoSong) {
            throw new Error(
                'There need to be songs in the database to create a demo lip.',
            )
        }

        const guests = await tx.select().from(guestsTable)

        const demoGuest = guests[Math.floor(Math.random() * guests.length)]!

        if (!demoGuest) {
            throw new Error(
                'There need to be guests in the database to create a demo lip.',
            )
        }

        const demoGuestName =
            DEMO_GUEST_NAMES[
                Math.floor(Math.random() * DEMO_GUEST_NAMES.length)
            ]!

        const prevLips = await tx
            .select()
            .from(lipsTable)
            .where(
                and(
                    eq(lipsTable.sessionId, sessionId),
                    eq(lipsTable.status, 'idle'),
                ),
            )

        return tx.insert(lipsTable).values({
            sessionId,
            songId: demoSong.id,
            guestId: demoGuest.id,
            singerName: demoGuestName,
            sortNumber: prevLips.length + 1,
        })
    })
}
