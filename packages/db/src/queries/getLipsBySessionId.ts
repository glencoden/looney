import { asc, eq, sql } from 'drizzle-orm'
import { db, Session } from '../index.js'
import { guestsTable } from '../schema/guestsTable.js'
import { lipsTable } from '../schema/lipsTable.js'
import { songsTable } from '../schema/songsTable.js'

export const getLipsBySessionId = (sessionId: Session['id']) => {
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

            isInternal: sql<
                boolean | null
            >`${guestsTable.internalId} IS NOT NULL`,

            artist: songsTable.artist,
            songTitle: songsTable.title,
            isFavoriteSong: songsTable.isFavorite,
        })
        .from(lipsTable)
        .innerJoin(guestsTable, eq(guestsTable.id, lipsTable.guestId))
        .innerJoin(songsTable, eq(songsTable.id, lipsTable.songId))
        .where(eq(lipsTable.sessionId, sessionId))
        .orderBy(asc(lipsTable.sortNumber))
}
