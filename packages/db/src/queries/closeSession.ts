import { eq } from 'drizzle-orm'
import { db, Session, sessionsTable } from '../index.js'

export const closeSession = async (sessionId: Session['id']) => {
    await db
        .update(sessionsTable)
        .set({
            endsAt: new Date(),
        })
        .where(eq(sessionsTable.id, sessionId))
}
