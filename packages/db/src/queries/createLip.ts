import { and, count, eq } from 'drizzle-orm'
import { db, LipInsert, lipsTable } from '../index.js'

export const createLip = async (lip: LipInsert) => {
    return db.transaction(async (tx) => {
        const [idleLips] = await tx
            .select({ count: count() })
            .from(lipsTable)
            .where(
                and(
                    eq(lipsTable.sessionId, lip.sessionId),
                    eq(lipsTable.status, 'idle'),
                ),
            )

        const idleLipsCount = idleLips?.count ?? 0

        const [insertedLip] = await tx
            .insert(lipsTable)
            .values({
                ...lip,
                sortNumber: idleLipsCount + 1,
            })
            .returning()

        return insertedLip ?? null
    })
}
