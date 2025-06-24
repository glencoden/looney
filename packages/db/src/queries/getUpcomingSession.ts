import { gt } from 'drizzle-orm'
import { db, sessionsTable } from '../index.js'

export const getUpcomingSession = async () => {
    const result = await db
        .select()
        .from(sessionsTable)
        .where(gt(sessionsTable.startsAt, new Date()))
        .limit(1)

    return result[0] ?? null
}
