import { and, count, eq, gte, inArray, lte, SQL, sql } from 'drizzle-orm'
import { db, lipsTable, songsTable, type Session } from '../index.js'

export const getSongInsights = (params?: {
    sessionIds?: Session['id'][]
    startDate?: Date
    endDate?: Date
}) => {
    const filterCallbacks: SQL[] = []

    if (params?.sessionIds) {
        filterCallbacks.push(inArray(lipsTable.sessionId, params.sessionIds))
    }

    if (params?.startDate) {
        filterCallbacks.push(gte(lipsTable.createdAt, params.startDate))
    }

    if (params?.endDate) {
        filterCallbacks.push(lte(lipsTable.createdAt, params.endDate))
    }

    return db
        .select({
            id: songsTable.id,
            title: songsTable.title,
            artist: songsTable.artist,
            count: count(),
            countStageCalls: count(
                sql`CASE WHEN ${lipsTable.status} IN ('live', 'no-show', 'done') THEN 1 END`,
            ),
            sessionIds: sql<
                Session['id'][]
            >`ARRAY_AGG(DISTINCT ${lipsTable.sessionId})`,
        })
        .from(lipsTable)
        .innerJoin(songsTable, eq(lipsTable.songId, songsTable.id))
        .where(and(...filterCallbacks))
        .groupBy(songsTable.id, songsTable.title, songsTable.artist)
}
