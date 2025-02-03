import { eq } from 'drizzle-orm'
import { db, Setlist, setlistsToSongsTable } from '../index.js'

export const copySongsToSetlist = (
    fromSetlistId: Setlist['id'],
    toSetlistId: Setlist['id'],
) => {
    return db.transaction(async (tx) => {
        const songs = await tx
            .select({ songId: setlistsToSongsTable.songId })
            .from(setlistsToSongsTable)
            .where(eq(setlistsToSongsTable.setlistId, fromSetlistId))

        await tx.insert(setlistsToSongsTable).values(
            songs.map((song) => ({
                setlistId: toSetlistId,
                songId: song.songId,
            })),
        )
    })
}
