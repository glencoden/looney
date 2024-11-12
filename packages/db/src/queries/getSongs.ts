import { asc } from 'drizzle-orm'
import { db, songsTable } from '../index.js'

export const getSongs = (withLyrics = false) => {
    return db
        .select({
            id: songsTable.id,
            artist: songsTable.artist,
            title: songsTable.title,
            isFavorite: songsTable.isFavorite,
            ...(withLyrics ? { lyrics: songsTable.lyrics } : {}),
        })
        .from(songsTable)
        .orderBy(asc(songsTable.artist), asc(songsTable.title))
}
