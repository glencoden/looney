import { eq } from 'drizzle-orm'
import { db, Session, sessionsTable } from '../index.js'

export const deleteSession = async (sessionId: Session['id']) => {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))
}
