import { asc } from 'drizzle-orm'
import { db } from '../index.js'
import { songsTable } from '../schema/songsTable.js'

export const getSongs = () => {
    return db
        .select({
            id: songsTable.id,
            artist: songsTable.artist,
            title: songsTable.title,
            isFavorite: songsTable.isFavorite,
        })
        .from(songsTable)
        .orderBy(asc(songsTable.artist))
}
