import { count, eq, max } from 'drizzle-orm'
import { db, Session } from '../index.js'
import { lipsTable } from '../schema/lipsTable.js'

export const getLipDigestBySessionId = async (sessionId: Session['id']) => {
    const [result] = await db
        .select({
            count: count(),
            lastUpdatedAt: max(lipsTable.updatedAt),
        })
        .from(lipsTable)
        .where(eq(lipsTable.sessionId, sessionId))

    return {
        count: result?.count ?? 0,
        lastUpdatedAt: result?.lastUpdatedAt ?? null,
    }
}
