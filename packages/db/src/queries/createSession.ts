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
                'There should only ever be one session with endsAt in the future.',
            )
        }

        if (activeSessions.length === 1) {
            throw new Error(
                'Cannot create a session while another session with endsAt in the future exists.',
            )
        }

        const result = await tx
            .insert(sessionsTable)
            .values(session)
            .returning({ id: sessionsTable.id })

        return result[0]?.id ?? null
    })
}
