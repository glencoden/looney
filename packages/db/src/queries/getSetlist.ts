import { eq } from 'drizzle-orm'
import { db, Setlist, setlistsTable } from '../index.js'

export const getSetlist = async (setlistId: Setlist['id']) => {
    const result = await db
        .select()
        .from(setlistsTable)
        .where(eq(setlistsTable.id, setlistId))

    return result[0] ?? null
}
