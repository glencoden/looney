import { eq } from 'drizzle-orm'
import { db, Setlist, setlistsTable } from '../index.js'

export const deleteSetlist = async (setlistId: Setlist['id']) => {
    await db.delete(setlistsTable).where(eq(setlistsTable.id, setlistId))
}
