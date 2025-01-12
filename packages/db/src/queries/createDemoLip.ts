import { and, eq } from 'drizzle-orm'
import {
    db,
    guestsTable,
    Lip,
    lipsTable,
    Session,
    songsTable,
} from '../index.js'

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

const MAX_NUM_DEMO_LIPS_PER_REQUEST = 5

export const createDemoLip = (sessionId: Session['id']) => {
    return db.transaction(async (tx) => {
        const numDemos = Math.ceil(
            Math.random() * MAX_NUM_DEMO_LIPS_PER_REQUEST,
        )

        const songs = await tx.select().from(songsTable)
        const guests = await tx.select().from(guestsTable)

        const prevLips = await tx
            .select()
            .from(lipsTable)
            .where(
                and(
                    eq(lipsTable.sessionId, sessionId),
                    eq(lipsTable.status, 'idle'),
                ),
            )

        const startSortNumber = prevLips.length + 1

        const demos: Pick<
            Lip,
            'songId' | 'guestId' | 'singerName' | 'sortNumber'
        >[] = []

        for (let i = 0; i < numDemos; i++) {
            const demoSong = songs[Math.floor(Math.random() * songs.length)]

            if (!demoSong) {
                throw new Error(
                    'There need to be songs in the database to create a demo lip.',
                )
            }

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

            demos.push({
                songId: demoSong.id,
                guestId: demoGuest.id,
                singerName: demoGuestName,
                sortNumber: startSortNumber + i,
            })
        }

        const inserts = demos.map((demo) => {
            return tx.insert(lipsTable).values({
                sessionId,
                ...demo,
            })
        })

        await Promise.all(inserts)

        return true
    })
}
