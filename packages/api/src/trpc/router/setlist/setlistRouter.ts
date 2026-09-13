import { setlistsTable } from '@repo/db'
import { hostProcedure } from '../../index.js'

export const setlistRouter = {
    getAll: hostProcedure.query(({ ctx }) => {
        return ctx.db.select().from(setlistsTable)
    }),
}
