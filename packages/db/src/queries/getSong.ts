import { eq } from 'drizzle-orm'
import { db } from '../index.js'
import { Song, songsTable } from '../schema/songsTable.js'

export const getSong = async (songId: Song['id']) => {
    const result = await db
        .select()
        .from(songsTable)
        .where(eq(songsTable.id, songId))

    return result[0] ?? null
}
