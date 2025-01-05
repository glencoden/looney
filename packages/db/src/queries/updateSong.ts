import { eq } from 'drizzle-orm'
import { db, Song, songsTable } from '../index.js'

export const updateSong = (
    song: Pick<Song, 'id'> & Partial<Omit<Song, 'id'>>,
) => {
    return db
        .update(songsTable)
        .set({ ...song, updatedAt: new Date() })
        .where(eq(songsTable.id, song.id))
}
