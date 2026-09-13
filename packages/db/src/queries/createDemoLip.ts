import { and, count, eq } from 'drizzle-orm'
import { LipInsert, db } from '../index.js'
import { guestsTable } from '../schema/guestsTable.js'
import { lipsTable } from '../schema/lipsTable.js'
import { authUserTable } from '../schema/authUserTable.js'

const getSingerNameByEmail = (email: string) => {
    switch (email) {
        case 'kussfabian@gmail.com':
            return 'Fabi'
        case 'nikolaipetersen@googlemail.com':
            return 'Petersen'
        case 'simon.der.meyer@gmail.com':
            return 'Meyer'
        case 'feniafranz@gmail.com':
            return 'Fenia'
        case 'beri.kernich@googlemail.com':
            return 'Beri'
        case 'info@stephanpfaff.de':
            return 'Pfaffi'
        default:
            return 'Host'
    }
}

export const createDemoLip = ({
    email,
    sessionId,
    songId,
}: {
    email: string
    sessionId: LipInsert['sessionId']
    songId: LipInsert['songId']
}) => {
    return db.transaction(async (tx) => {
        const [user] = await tx
            .select({ id: authUserTable.id })
            .from(authUserTable)
            .where(eq(authUserTable.email, email))
            .limit(1)

        if (!user) {
            throw new Error('No user found to create a demo lip')
        }

        const [guest] = await tx
            .select({ id: guestsTable.id })
            .from(guestsTable)
            .where(
                and(
                    eq(guestsTable.internalId, user.id),
                    eq(guestsTable.sessionId, sessionId),
                ),
            )
            .limit(1)

        let guestId = guest?.id

        if (!guestId) {
            const [insertedGuest] = await tx
                .insert(guestsTable)
                .values({
                    internalId: user.id,
                    sessionId: sessionId,
                })
                .returning({ id: guestsTable.id })

            guestId = insertedGuest?.id
        }

        if (!guestId) {
            throw new Error(
                'Something went wrong getting a guest to create a demo lip',
            )
        }

        const [idleLips] = await tx
            .select({ count: count() })
            .from(lipsTable)
            .where(
                and(
                    eq(lipsTable.sessionId, sessionId),
                    eq(lipsTable.status, 'idle'),
                ),
            )

        const idleLipsCount = idleLips?.count ?? 0

        const [insertedLip] = await tx
            .insert(lipsTable)
            .values({
                sessionId,
                songId,
                guestId,
                singerName: getSingerNameByEmail(email),
                sortNumber: idleLipsCount + 1,
            })
            .returning({ id: guestsTable.id })

        return insertedLip?.id ?? null
    })
}
