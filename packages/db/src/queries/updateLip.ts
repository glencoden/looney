import { eq } from 'drizzle-orm'
import { db, Lip, lipsTable } from '../index.js'

export const updateLip = (
    lip: Pick<Lip, 'id'> & Partial<Omit<Lip, 'id'>>,
): Promise<Lip[]> => {
    return db.update(lipsTable).set(lip).where(eq(lipsTable.id, lip.id))
}
