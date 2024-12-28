import { asc } from 'drizzle-orm'
import { db, setlistsTable } from '../index.js'

export const getSetlists = () => {
    return db.select().from(setlistsTable).orderBy(asc(setlistsTable.title))
}
