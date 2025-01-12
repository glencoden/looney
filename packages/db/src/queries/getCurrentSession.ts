import { and, eq, gt, lt } from 'drizzle-orm'
import { db, sessionsTable } from '../index.js'

export const getCurrentSession = async (includeDemo?: boolean) => {
    const currentDate = new Date()
    const result = await db
        .select()
        .from(sessionsTable)
        .where(
            and(
                lt(sessionsTable.startsAt, currentDate),
                gt(sessionsTable.endsAt, currentDate),
                includeDemo ? undefined : eq(sessionsTable.isDemo, false),
            ),
        )

    if (result.length > 1) {
        throw new Error('There should only ever be one active session.')
    }

    return result[0] ?? null
}
