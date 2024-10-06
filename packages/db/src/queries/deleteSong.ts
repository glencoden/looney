import { eq } from 'drizzle-orm'
import { db, Song, songsTable } from '../index.js'

export const deleteSong = (songId: Song['id']) => {
    return db.delete(songsTable).where(eq(songsTable.id, songId))
}
