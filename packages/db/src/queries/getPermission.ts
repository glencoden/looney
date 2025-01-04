import { eq } from 'drizzle-orm'
import { db, Permission } from '../index.js'
import { permissionsTable } from '../schema/permissionsTable.js'

export const getPermission = (email: Permission['email']) => {
    return db
        .select({
            role: permissionsTable.role,
        })
        .from(permissionsTable)
        .where(eq(permissionsTable.email, email))
}
