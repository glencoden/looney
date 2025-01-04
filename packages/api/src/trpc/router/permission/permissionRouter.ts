import { PermissionSchema } from '@repo/db'
import { getPermission } from '@repo/db/queries'
import { protectedProcedure } from '../../index.js'

export const permissionRouter = {
    get: protectedProcedure
        .input(PermissionSchema.pick({ email: true }))
        .query(async ({ input }) => {
            const result = await getPermission(input.email)
            return result[0]?.role ?? null
        }),
}
