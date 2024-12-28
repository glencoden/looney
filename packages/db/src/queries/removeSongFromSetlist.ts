import { and, eq } from 'drizzle-orm'
import { setlistsToSongsTable } from '../index.js'

import { db, SetlistToSong } from '../index.js'

export const removeSongFromSetlist = ({ setlistId, songId }: SetlistToSong) => {
    return db
        .delete(setlistsToSongsTable)
        .where(
            and(
                eq(setlistsToSongsTable.setlistId, setlistId),
                eq(setlistsToSongsTable.songId, songId),
            ),
        )
}
