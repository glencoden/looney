import { eq } from 'drizzle-orm'
import { db, Session, sessionsTable } from '../index.js'

export const getSession = async (sessionId: Session['id']) => {
    const result = await db
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, sessionId))

    return result[0] ?? null
}
