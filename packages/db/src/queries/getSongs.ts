import { asc, or, sql } from 'drizzle-orm'
import { db, songsTable } from '../index.js'

export const getSongs = (q: string | null = null, withLyrics = false) => {
    const query = db
        .select({
            id: songsTable.id,
            artist: songsTable.artist,
            title: songsTable.title,
            genre: songsTable.genre,
            isFavorite: songsTable.isFavorite,
            ...(withLyrics ? { lyrics: songsTable.lyrics } : {}),
        })
        .from(songsTable)
        .orderBy(
            asc(songsTable.genre),
            asc(songsTable.artist),
            asc(songsTable.title),
        )

    if (q !== null) {
        return query.where(
            or(
                sql`${songsTable.artist} ILIKE ${`%${q}%`}`,
                sql`${songsTable.title} ILIKE ${`%${q}%`}`,
            ),
        )
    }

    return query
}
