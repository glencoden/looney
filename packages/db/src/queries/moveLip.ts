import { and, eq, inArray, sql } from 'drizzle-orm'
import { db, Lip, lipsTable } from '../index.js'

export const moveLip = async (
    lips: Pick<Lip, 'id' | 'status' | 'sortNumber'>[],
) => {
    return db
        .update(lipsTable)
        .set({
            status: sql`CASE id ${lips
                .map((lip) => sql`WHEN ${lip.id} THEN ${lip.status}`)
                .reduce((acc, curr) => sql`${acc} ${curr}`)} ELSE status END`,
            sortNumber: sql`CASE id ${lips
                .map((lip) => sql`WHEN ${lip.id} THEN ${lip.sortNumber}`)
                .reduce(
                    (acc, curr) => sql`${acc} ${curr}`,
                )} ELSE sort_number END`,
            updatedAt: new Date(),
        })
        .where(
            inArray(
                lipsTable.id,
                lips.map((lip) => lip.id),
            ),
        )
}

export const moveLipDeprecated = (
    payload: Pick<Lip, 'id' | 'sessionId' | 'status' | 'sortNumber'> &
        Partial<Omit<Lip, 'id' | 'sessionId' | 'status' | 'sortNumber'>>,
): Promise<boolean> => {
    if (payload.sortNumber === null) {
        throw new Error('Can not move a lip without a target sort number.')
    }

    return db.transaction(async (tx) => {
        const [fromLip] = await tx
            .select()
            .from(lipsTable)
            .where(eq(lipsTable.id, payload.id))
            .limit(1)

        if (!fromLip) {
            throw new Error('Could not find lip to update.')
        }
        if (fromLip.sortNumber === null) {
            throw new Error(
                'Can not move a lip without an affected sort number.',
            )
        }

        if (payload.status === 'live') {
            const [actionLip] = await tx
                .select()
                .from(lipsTable)
                .where(
                    and(
                        eq(lipsTable.sessionId, payload.sessionId),
                        eq(lipsTable.status, 'live'),
                    ),
                )
                .limit(1)

            if (actionLip) {
                const hour = 1000 * 60 * 60
                const isNoShow =
                    actionLip.updatedAt &&
                    (Date.now() % hour) -
                        (actionLip.updatedAt.getTime() % hour) <
                        1000 * 60 * 3
                await tx
                    .update(lipsTable)
                    .set({
                        status: isNoShow ? 'no-show' : 'done',
                        sortNumber: 1,
                        updatedAt: new Date(),
                    })
                    .where(eq(lipsTable.id, actionLip.id))
            }
        }

        if (payload.status === fromLip.status) {
            // CASE A: Moved within the same list.
            //
            // We update all rows in the given session and status in one UPDATE,
            // using a CASE expression:
            //
            // - The moved lip gets its new sortNumber.
            // - If moving _down_ (i.e. to a larger sort number), every lip whose
            //   sortNumber falls between fromLip.sortNumber+1 and payload.sortNumber
            //   gets decremented by 1.
            // - If moving _up_ (i.e. to a smaller sort number), every lip whose
            //   sortNumber falls between payload.sortNumber and fromLip.sortNumber-1
            //   gets incremented by 1.
            await tx
                .update(lipsTable)
                .set({
                    sortNumber: sql<number>`CASE
                        WHEN id = ${payload.id} THEN ${payload.sortNumber}
                        WHEN ${payload.sortNumber} > ${fromLip.sortNumber} AND sort_number BETWEEN ${fromLip.sortNumber} + 1 AND ${payload.sortNumber} THEN sort_number - 1
                        WHEN ${payload.sortNumber} < ${fromLip.sortNumber} AND sort_number BETWEEN ${payload.sortNumber} AND ${fromLip.sortNumber} - 1 THEN sort_number + 1
                        ELSE sort_number END`,
                })
                .where(
                    and(
                        eq(lipsTable.sessionId, payload.sessionId),
                        eq(lipsTable.status, payload.status),
                    ),
                )
        } else {
            // CASE B: Moved to a different list.
            //
            // First, update the source list: any lip in the source status with a
            // sortNumber greater than the moved lip's sortNumber gets decremented.
            await tx
                .update(lipsTable)
                .set({ sortNumber: sql`sort_number - 1` })
                .where(
                    and(
                        eq(lipsTable.sessionId, payload.sessionId),
                        eq(lipsTable.status, fromLip.status),
                        sql`sort_number > ${fromLip.sortNumber}`,
                    ),
                )

            await tx
                .update(lipsTable)
                .set({ sortNumber: sql`sort_number + 1` })
                .where(
                    and(
                        eq(lipsTable.sessionId, payload.sessionId),
                        eq(lipsTable.status, payload.status),
                        sql`sort_number >= ${payload.sortNumber}`,
                    ),
                )
        }

        await tx
            .update(lipsTable)
            .set({
                status: payload.status,
                sortNumber: payload.sortNumber,
                updatedAt: new Date(),
            })
            .where(eq(lipsTable.id, payload.id))

        return true
    })
}
