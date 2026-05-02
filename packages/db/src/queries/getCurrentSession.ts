import { gt } from 'drizzle-orm'
import { db, sessionsTable } from '../index.js'

export const getCurrentSession = async () => {
    const result = await db
        .select()
        .from(sessionsTable)
        .where(gt(sessionsTable.endsAt, new Date()))

    if (result.length > 1) {
        throw new Error(
            'There should only ever be one session with endsAt in the future.',
        )
    }

    return result[0] ?? null
}
