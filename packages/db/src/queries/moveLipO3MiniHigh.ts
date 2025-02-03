import { and, eq, or, sql } from 'drizzle-orm'
import { db, Lip, lipsTable } from '../index.js'

export const moveLip = (
    payload: Pick<Lip, 'id' | 'sessionId' | 'status' | 'sortNumber'> &
        Partial<Omit<Lip, 'id' | 'sessionId' | 'status' | 'sortNumber'>>,
): Promise<boolean> => {
    if (payload.sortNumber === null) {
        throw new Error('Can not move a lip without a target sort number.')
    }

    return db.transaction(async (tx) => {
        // 1. Fetch the lip to move
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

        // 2. Depending on whether we are moving within the same list (status) or to a different one,
        // perform one or two bulk updates to adjust the sort numbers.

        if (fromLip.status === payload.status) {
            // --- Moving within the same list ---
            if (payload.sortNumber! > fromLip.sortNumber) {
                // Moved down: for every lip whose sort_number is greater than the old position
                // and less than or equal to the new position, decrement sort_number by 1.
                await tx
                    .update(lipsTable)
                    .set({
                        sortNumber: sql`${lipsTable.sortNumber} - 1`,
                    })
                    .where(
                        and(
                            eq(lipsTable.sessionId, payload.sessionId),
                            eq(lipsTable.status, payload.status),
                            sql`${lipsTable.id} != ${payload.id}`,
                            sql`${lipsTable.sortNumber} > ${fromLip.sortNumber}`,
                            sql`${lipsTable.sortNumber} <= ${payload.sortNumber}`,
                        ),
                    )
            } else if (payload.sortNumber! < fromLip.sortNumber) {
                // Moved up: for every lip whose sort_number is greater than or equal to the new position
                // and less than the old position, increment sort_number by 1.
                await tx
                    .update(lipsTable)
                    .set({
                        sortNumber: sql`${lipsTable.sortNumber} + 1`,
                    })
                    .where(
                        and(
                            eq(lipsTable.sessionId, payload.sessionId),
                            eq(lipsTable.status, payload.status),
                            sql`${lipsTable.id} != ${payload.id}`,
                            sql`${lipsTable.sortNumber} >= ${payload.sortNumber}`,
                            sql`${lipsTable.sortNumber} < ${fromLip.sortNumber}`,
                        ),
                    )
            }
        } else {
            // --- Moving between lists ---
            // For the old list (fromLip.status): decrement the sort_number of every lip
            // that was after the moved lip.
            await tx
                .update(lipsTable)
                .set({
                    sortNumber: sql`${lipsTable.sortNumber} - 1`,
                })
                .where(
                    and(
                        eq(lipsTable.sessionId, payload.sessionId),
                        eq(lipsTable.status, fromLip.status),
                        sql`${lipsTable.sortNumber} > ${fromLip.sortNumber}`,
                    ),
                )

            // For the new list (payload.status): increment the sort_number of every lip that
            // is at or after the target position.
            await tx
                .update(lipsTable)
                .set({
                    sortNumber: sql`${lipsTable.sortNumber} + 1`,
                })
                .where(
                    and(
                        eq(lipsTable.sessionId, payload.sessionId),
                        eq(lipsTable.status, payload.status),
                        sql`${lipsTable.sortNumber} >= ${payload.sortNumber}`,
                    ),
                )
        }

        // 3. Handle the special case for the "action lip" if moving to the staged list.
        if (payload.status === 'staged') {
            const [actionLip] = await tx
                .select()
                .from(lipsTable)
                .where(
                    and(
                        eq(lipsTable.sessionId, payload.sessionId),
                        or(
                            eq(lipsTable.status, 'staged'),
                            eq(lipsTable.status, 'live'),
                        ),
                    ),
                )
                .limit(1)

            if (actionLip) {
                await tx
                    .update(lipsTable)
                    .set({
                        status:
                            actionLip.status === 'staged' ? 'no-show' : 'done',
                        sortNumber: 1,
                    })
                    .where(eq(lipsTable.id, actionLip.id))
            }
        }

        // 4. Finally, update the moved lip itself.
        await tx
            .update(lipsTable)
            .set(payload)
            .where(eq(lipsTable.id, payload.id))

        return true
    })
}
