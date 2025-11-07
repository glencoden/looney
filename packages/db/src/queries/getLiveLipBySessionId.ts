import { and, eq } from 'drizzle-orm'
import { db, lipsTable, Session, songsTable } from '../index.js'

export const getLiveLipBySessionId = async (sessionId: Session['id']) => {
    const [liveLip] = await db
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

            artist: songsTable.artist,
            songTitle: songsTable.title,
            isFavoriteSong: songsTable.isFavorite,
        })
        .from(lipsTable)
        .innerJoin(songsTable, eq(songsTable.id, lipsTable.songId))
        .where(
            and(
                eq(lipsTable.sessionId, sessionId),
                eq(lipsTable.status, 'live'),
            ),
        )
        .limit(1)

    return liveLip ?? null
}
