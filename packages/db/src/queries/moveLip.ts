import { eq, inArray, sql } from 'drizzle-orm'
import { db, Lip, lipsTable } from '../index.js'

const NO_SHOW_THRESHOLD = 1000 * 60 * 3

export const moveLip = async (
    lips: Pick<Lip, 'id' | 'status' | 'sortNumber'>[], // status needs to be updated because moving a lip to the live stack sets the current live lip's status to 'done'
    movedLip: Pick<Lip, 'id' | 'status'>,
) => {
    return db.transaction(async (tx) => {
        /**
         *
         * Sort the lips
         *
         */
        await tx
            .update(lipsTable)
            .set({
                status: sql`CASE id ${lips
                    .map((lip) => sql`WHEN ${lip.id} THEN ${lip.status}`)
                    .reduce(
                        (acc, curr) => sql`${acc} ${curr}`,
                    )} ELSE status END`,
                sortNumber: sql`CASE id ${lips
                    .map((lip) => sql`WHEN ${lip.id} THEN ${lip.sortNumber}`)
                    .reduce(
                        (acc, curr) => sql`${acc} ${curr}`,
                    )} ELSE sort_number END`,
            })
            .where(
                inArray(
                    lipsTable.id,
                    lips.map((lip) => lip.id),
                ),
            )

        /**
         *
         * Update the moved lip
         *
         */
        const now = new Date()

        const [prev] = await tx
            .select({
                status: lipsTable.status,
                updatedAt: lipsTable.updatedAt,
            })
            .from(lipsTable)
            .where(eq(lipsTable.id, movedLip.id))
            .limit(1)

        const isNoShow =
            prev &&
            prev.status === 'live' &&
            prev.updatedAt &&
            now.getTime() - prev.updatedAt.getTime() < NO_SHOW_THRESHOLD

        return tx
            .update(lipsTable)
            .set({
                status: movedLip.status,
                ...(movedLip.status === 'selected' ? { selectedAt: now } : {}),
                ...(movedLip.status === 'live' ? { liveAt: now } : {}),
                ...(movedLip.status === 'done' ? { doneAt: now } : {}),
                ...(movedLip.status === 'deleted' ? { deletedAt: now } : {}),
                ...(isNoShow ? { noShowAt: now } : {}),
                updatedAt: now,
            })
            .where(eq(lipsTable.id, movedLip.id))
    })
}
