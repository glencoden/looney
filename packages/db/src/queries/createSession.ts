import { gt } from 'drizzle-orm'
import { db, SessionInsert, sessionsTable } from '../index.js'

export const createSession = (session: SessionInsert) => {
    return db.transaction(async (tx) => {
        const activeSessions = await tx
            .select()
            .from(sessionsTable)
            .where(gt(sessionsTable.endsAt, new Date()))

        if (activeSessions.length > 1) {
            throw new Error(
                'There should only ever by one or less ongoing or upcoming sessions (endsAt in the future).',
            )
        }

        if (activeSessions.length === 1) {
            throw new Error(
                'A query to create a session while another session is going on or coming up (endsAt in the future) should never happen.',
            )
        }

        const result = await tx
            .insert(sessionsTable)
            .values(session)
            .returning({ id: sessionsTable.id })

        return result[0]?.id ?? null
    })
}
