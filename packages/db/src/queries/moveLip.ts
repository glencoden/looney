import { eq, inArray, sql } from 'drizzle-orm'
import { db, Lip, lipsTable } from '../index.js'

export const moveLip = async (
    lips: Pick<Lip, 'id' | 'sortNumber'>[], // updated sort numbers for all lips
    movedLip: Pick<Lip, 'id' | 'status'>,
) => {
    return db.transaction(async (tx) => {
        await tx
            .update(lipsTable)
            .set({
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

        return tx
            .update(lipsTable)
            .set({
                status: movedLip.status,
                updatedAt: new Date(),
            })
            .where(eq(lipsTable.id, movedLip.id))
    })
}
