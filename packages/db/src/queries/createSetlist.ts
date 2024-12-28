import { db, SetlistInsert, setlistsTable } from '../index.js'

export const createSetlist = async (setlist: SetlistInsert) => {
    const result = await db
        .insert(setlistsTable)
        .values(setlist)
        .returning({ id: setlistsTable.id })

    return result[0]?.id ?? null
}
