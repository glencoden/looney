import { db, setlistsToSongsTable, SetlistToSongInsert } from '../index.js'

export const addSongToSetlist = ({
    setlistId,
    songId,
}: SetlistToSongInsert) => {
    return db.insert(setlistsToSongsTable).values({
        setlistId,
        songId,
    })
}
