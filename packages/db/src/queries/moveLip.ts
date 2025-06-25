import { eq, inArray, sql } from 'drizzle-orm'
import { db, Lip, lipsTable } from '../index.js'

export const moveLip = async (
    lips: Pick<Lip, 'id' | 'status' | 'sortNumber'>[], // status needs to be updated because moving a lip to the live stack sets the current live lip's status
    movedLip: Pick<Lip, 'id' | 'status'>,
) => {
    return db.transaction(async (tx) => {
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

        return tx
            .update(lipsTable)
            .set({
                status: movedLip.status,
                updatedAt: new Date(),
            })
            .where(eq(lipsTable.id, movedLip.id))
    })
}
