import { eq } from 'drizzle-orm'
import { db, Session, sessionsTable } from '../index.js'

export const updateSession = (
    session: Pick<Session, 'id'> & Partial<Omit<Session, 'id'>>,
): Promise<Session[]> => {
    return db
        .update(sessionsTable)
        .set(session)
        .where(eq(sessionsTable.id, session.id))
}
