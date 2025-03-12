import { and, eq, gt, lt } from 'drizzle-orm'
import { db, sessionsTable } from '../index.js'

export const getCurrentSession = async (includeDemo?: boolean) => {
    const currentDate = new Date()

    if (includeDemo) {
        const result = await db
            .select()
            .from(sessionsTable)
            .where(
                and(
                    lt(sessionsTable.startsAt, currentDate),
                    gt(sessionsTable.endsAt, currentDate),
                ),
            )

        if (result.length > 1) {
            throw new Error('There should only ever be one demo session.')
        }

        return result[0] ?? null
    }

    const result = await db
        .select()
        .from(sessionsTable)
        .where(
            and(
                lt(sessionsTable.startsAt, currentDate),
                gt(sessionsTable.endsAt, currentDate),
                eq(sessionsTable.isDemo, false),
            ),
        )

    console.log('LIVE RESULT', result)

    if (result.length > 1) {
        throw new Error('There should only ever be one active session.')
    }

    return result[0] ?? null
}
