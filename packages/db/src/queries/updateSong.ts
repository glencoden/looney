import { eq } from 'drizzle-orm'
import { db, Song, songsTable } from '../index.js'

export const updateSong = (song: Partial<Song> & { id: Song['id'] }) => {
    return db
        .update(songsTable)
        .set({ ...song, updatedAt: new Date() })
        .where(eq(songsTable.id, song.id))
}
