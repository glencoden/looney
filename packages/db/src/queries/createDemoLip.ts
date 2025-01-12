import { and, eq } from 'drizzle-orm'
import { db, guestsTable, lipsTable, Session, songsTable } from '../index.js'

const DEMO_GUEST_NAMES = [
    'Bugs Bunny',
    'Daffy Duck',
    'Porky Pig',
    'Elmer Fudd',
    'Sylvester the Cat',
    'Tweety Bird',
    'Wile E. Coyote',
    'Road Runner',
    'Yosemite Sam',
    'Marvin the Martian',
    'Foghorn Leghorn',
    'Tasmanian Devil',
    'Speedy Gonzales',
    'Granny',
    'Pepe Le Pew',
    'Henery Hawk',
    'Gossamer (the big red monster)',
    'Sam Sheepdog',
    'Barnyard Dawg',
    'Lola Bunny',
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
