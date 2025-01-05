import { asc, gt } from 'drizzle-orm'
import { db, GuestInsert, guestsTable, sessionsTable } from '../index.js'

export const createGuest = () => {
    return db.transaction(async (tx) => {
        const joinableSessions = await tx
            .select()
            .from(sessionsTable)
            .where(gt(sessionsTable.endsAt, new Date()))
            .orderBy(asc(sessionsTable.endsAt))

        const insertValues: GuestInsert = {}

        const sessionId = joinableSessions[0]?.id

        if (sessionId) {
            insertValues.sessionId = sessionId
        }

        const result = await tx
            .insert(guestsTable)
            .values(insertValues)
            .returning()

        return result[0] ?? null
    })
}
