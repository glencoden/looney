import { inArray, sql } from 'drizzle-orm'
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
