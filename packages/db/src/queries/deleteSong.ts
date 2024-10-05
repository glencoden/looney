import { eq } from 'drizzle-orm'
import { db } from '../index.js'
import { Song, songsTable } from '../schema/songsTable.js'

export const deleteSong = (songId: Song['id']) => {
    return db.delete(songsTable).where(eq(songsTable.id, songId))
}
