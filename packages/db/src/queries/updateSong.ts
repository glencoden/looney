import { eq } from 'drizzle-orm'
import { db, Song, SongInsert, songsTable } from '../index.js'

export const updateSong = (song: SongInsert & { id: Song['id'] }) => {
    return db.update(songsTable).set(song).where(eq(songsTable.id, song.id))
}
