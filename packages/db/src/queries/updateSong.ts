import { eq } from 'drizzle-orm'
import { db } from '../index.js'
import { Song, SongInsert, songsTable } from '../schema/songsTable.js'

export const updateSong = (song: SongInsert & { id: Song['id'] }) => {
    return db.update(songsTable).set(song).where(eq(songsTable.id, song.id))
}
