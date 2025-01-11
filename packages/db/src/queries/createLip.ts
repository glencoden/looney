import { and, eq } from 'drizzle-orm'
import { db, LipInsert, lipsTable } from '../index.js'

export const createLip = async (lip: LipInsert) => {
    return db.transaction(async (tx) => {
        const prevLips = await tx
            .select()
            .from(lipsTable)
            .where(
                and(
                    eq(lipsTable.sessionId, lip.sessionId),
                    eq(lipsTable.status, 'idle'),
                ),
            )

        const result = await tx
            .insert(lipsTable)
            .values({
                ...lip,
                sortNumber: prevLips.length + 1,
            })
            .returning()

        return result[0] ?? null
    })
}
