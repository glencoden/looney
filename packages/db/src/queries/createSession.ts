import { and, eq, gt, lt } from 'drizzle-orm'
import { db, SessionInsert, sessionsTable } from '../index.js'

export const createSession = (session: SessionInsert) => {
    return db.transaction(async (tx) => {
        const currentDate = new Date()
        const activeSessions = await tx
            .select()
            .from(sessionsTable)
            .where(
                and(
                    lt(sessionsTable.startsAt, currentDate),
                    gt(sessionsTable.endsAt, currentDate),
                ),
            )

        const currentSession = activeSessions[0] ?? null

        if (currentSession) {
            if (!currentSession.isDemo) {
                throw new Error(
                    'A query to create a session while another non-demo session is ongoing should never happen.',
                )
            }
            await tx
                .delete(sessionsTable)
                .where(eq(sessionsTable.id, currentSession.id))
        }

        const result = await tx
            .insert(sessionsTable)
            .values(session)
            .returning({ id: sessionsTable.id })

        return result[0]?.id ?? null
    })
}
