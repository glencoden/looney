import { eq } from 'drizzle-orm'
import { db, Guest, guestsTable } from '../index.js'

export const updateGuest = (
    guest: Pick<Guest, 'id'> & Partial<Omit<Guest, 'id'>>,
): Promise<Guest[]> => {
    return db.update(guestsTable).set(guest).where(eq(guestsTable.id, guest.id))
}
