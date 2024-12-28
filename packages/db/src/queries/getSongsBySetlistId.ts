import { asc, eq } from 'drizzle-orm'
import { db, Setlist, setlistsToSongsTable, songsTable } from '../index.js'

export const getSongsBySetlistId = (
    setlistId: Setlist['id'],
    noGenreSort = false,
) => {
    const orderCallbacks = [
        asc(songsTable.genre),
        asc(songsTable.artist),
        asc(songsTable.title),
    ]

    if (noGenreSort) {
        orderCallbacks.shift()
    }

    return db
        .select({
            id: songsTable.id,
            artist: songsTable.artist,
            title: songsTable.title,
            genre: songsTable.genre,
            isFavorite: songsTable.isFavorite,
        })
        .from(songsTable)
        .innerJoin(
            setlistsToSongsTable,
            eq(setlistsToSongsTable.songId, songsTable.id),
        )
        .where(eq(setlistsToSongsTable.setlistId, setlistId))
        .orderBy(...orderCallbacks)
}
