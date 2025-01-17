import { and, eq, sql } from 'drizzle-orm'
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

const NUM_DEMO_LIPS_PER_REQUEST = 4

export const createDemoLip = (sessionId: Session['id']) => {
    return db.transaction(async (tx) => {
        const numDemos = NUM_DEMO_LIPS_PER_REQUEST

        const songs = await tx
            .select()
            .from(songsTable)
            .limit(numDemos)
            .orderBy(sql`RANDOM()`)

        if (songs.length < numDemos) {
            throw new Error(
                `There are only ${songs.length} songs and you requested ${numDemos} demo lips.`,
            )
        }

        const guests = await tx
            .select()
            .from(guestsTable)
            .limit(numDemos)
            .orderBy(sql`RANDOM()`)

        if (guests.length < numDemos) {
            throw new Error(
                `There are only ${guests.length} guests and you requested ${numDemos} demo lips.`,
            )
        }

        const prevLipsCount = (await tx
            .select({ count: sql<number>`count(*)` })
            .from(lipsTable)
            .where(
                and(
                    eq(lipsTable.sessionId, sessionId),
                    eq(lipsTable.status, 'idle'),
                ),
            )
            .then((result) => result[0]?.count ?? 0)) as string // prob drizzle type error

        const startSortNumber = parseInt(prevLipsCount) + 1

        await tx.insert(lipsTable).values(
            Array.from({ length: numDemos }, (_, i) => {
                const songId = songs[i]?.id
                const guestId = guests[i]?.id
                if (!songId || !guestId) {
                    throw new Error('Missing songId or guestId')
                }
                return {
                    sessionId,
                    songId,
                    guestId,
                    singerName:
                        DEMO_GUEST_NAMES[
                            Math.floor(Math.random() * DEMO_GUEST_NAMES.length)
                        ]!,
                    sortNumber: startSortNumber + i,
                }
            }),
        )

        return true
    })
}
