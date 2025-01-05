import { eq } from 'drizzle-orm'
import { db, Guest, guestsTable } from '../index.js'

export const getGuest = async (guestId: Guest['id']) => {
    const result = await db
        .select()
        .from(guestsTable)
        .where(eq(guestsTable.id, guestId))

    return result[0] ?? null
}
