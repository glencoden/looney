import { asc, eq, sql } from 'drizzle-orm'
import { db, Guest, lipsTable, songsTable } from '../index.js'

export const getLipsByGuestId = (guestId: Guest['id']) => {
    return db
        .select({
            id: lipsTable.id,
            sessionId: lipsTable.sessionId,
            songId: lipsTable.songId,
            guestId: lipsTable.guestId,
            singerName: lipsTable.singerName,
            status: lipsTable.status,
            sortNumber: lipsTable.sortNumber,
            createdAt: lipsTable.createdAt,
            updatedAt: lipsTable.updatedAt,

            // Set to null to save a join with guestsTable (see `getLipsBySessionId`) because atm a guest querying lips is not interested in this value
            isInternal: sql<boolean | null>`NULL`,

            artist: songsTable.artist,
            songTitle: songsTable.title,
            isFavoriteSong: songsTable.isFavorite,
        })
        .from(lipsTable)
        .innerJoin(songsTable, eq(songsTable.id, lipsTable.songId))
        .where(eq(lipsTable.guestId, guestId))
        .orderBy(asc(lipsTable.sortNumber))
}
