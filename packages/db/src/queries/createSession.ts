import { and, eq, gt } from 'drizzle-orm'
import { db, SessionInsert, sessionsTable } from '../index.js'

export const createSession = (session: SessionInsert) => {
    return db.transaction(async (tx) => {
        const activeSessions = await tx
            .select()
            .from(sessionsTable)
            .where(
                and(
                    gt(sessionsTable.endsAt, new Date()),
                    eq(sessionsTable.isDemo, false),
                ),
            )

        if (activeSessions.length > 1) {
            throw new Error(
                'There should only ever by one or less ongoing or upcoming sessions (endsAt in the future).',
            )
        }

        if (activeSessions.length === 1) {
            throw new Error(
                'A query to create a session while another non-demo session is going on or coming up (endsAt in the future) should never happen.',
            )
        }

        const demoSessions = await tx
            .select()
            .from(sessionsTable)
            .where(eq(sessionsTable.isDemo, true))

        if (demoSessions.length > 1) {
            throw new Error(
                'When on every session creation the most recent demo session is deleted, there should never be more than one demo session.',
            )
        }

        const mostRecentDemoSession = demoSessions[0]

        if (mostRecentDemoSession) {
            await tx
                .delete(sessionsTable)
                .where(eq(sessionsTable.id, mostRecentDemoSession.id))
        }

        const result = await tx
            .insert(sessionsTable)
            .values(session)
            .returning({ id: sessionsTable.id })

        return result[0]?.id ?? null
    })
}
