import { eq } from 'drizzle-orm'
import { db, Song, songsTable } from '../index.js'

export const getSong = async (songId: Song['id']) => {
    const result = await db
        .select()
        .from(songsTable)
        .where(eq(songsTable.id, songId))

    return result[0] ?? null
}
