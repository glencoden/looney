import { db } from '../index.js'
import { SongInsert, songsTable } from '../schema/songsTable.js'

export const createSong = async (song: SongInsert) => {
    const result = await db
        .insert(songsTable)
        .values(song)
        .returning({ id: songsTable.id })

    return result[0]?.id ?? null
}
