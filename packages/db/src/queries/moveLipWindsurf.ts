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
        // Get the source lip and action lip in a single query
        const [fromLip, actionLip] = await Promise.all([
            tx
                .select()
                .from(lipsTable)
                .where(eq(lipsTable.id, payload.id))
                .limit(1)
                .then((results) => results[0]),
            tx
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
                .then((results) => results[0]),
        ])

        if (!fromLip) {
            throw new Error('Could not find lip to update.')
        }

        if (fromLip.sortNumber === null) {
            throw new Error(
                'Can not move a lip without an affected sort number.',
            )
        }

        // Handle action lip update if moving to staged
        if (actionLip && payload.status === 'staged') {
            await tx
                .update(lipsTable)
                .set({
                    status: actionLip.status === 'staged' ? 'no-show' : 'done',
                    sortNumber: 1,
                })
                .where(eq(lipsTable.id, actionLip.id))
        }

        // Update sort numbers in a single query for each status
        if (fromLip.status === payload.status) {
            // Moving within the same status - update sort numbers in a single query
            await tx
                .update(lipsTable)
                .set({
                    sortNumber: sql`CASE 
                        WHEN id = ${payload.id} THEN ${payload.sortNumber}
                        WHEN sort_number > ${fromLip.sortNumber} AND sort_number <= ${payload.sortNumber} THEN sort_number - 1
                        WHEN sort_number < ${fromLip.sortNumber} AND sort_number >= ${payload.sortNumber} THEN sort_number + 1
                        ELSE sort_number
                    END`,
                })
                .where(
                    and(
                        eq(lipsTable.sessionId, payload.sessionId),
                        eq(lipsTable.status, payload.status),
                        sql`sort_number IS NOT NULL`,
                    ),
                )
        } else {
            // Moving between different statuses - update both source and target lists
            await Promise.all([
                // Update source list
                tx
                    .update(lipsTable)
                    .set({
                        sortNumber: sql`sort_number - 1`,
                    })
                    .where(
                        and(
                            eq(lipsTable.sessionId, payload.sessionId),
                            eq(lipsTable.status, fromLip.status),
                            sql`sort_number > ${fromLip.sortNumber}`,
                            sql`sort_number IS NOT NULL`,
                        ),
                    ),
                // Update target list
                tx
                    .update(lipsTable)
                    .set({
                        sortNumber: sql`sort_number + 1`,
                    })
                    .where(
                        and(
                            eq(lipsTable.sessionId, payload.sessionId),
                            eq(lipsTable.status, payload.status),
                            sql`sort_number >= ${payload.sortNumber}`,
                            sql`sort_number IS NOT NULL`,
                        ),
                    ),
            ])
        }

        // Update the moved lip last
        await tx
            .update(lipsTable)
            .set({
                status: payload.status,
                sortNumber: payload.sortNumber,
            })
            .where(eq(lipsTable.id, payload.id))

        return true
    })
}
