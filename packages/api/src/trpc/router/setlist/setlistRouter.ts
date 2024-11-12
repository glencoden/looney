import { setlistsTable } from '@repo/db'
import { protectedProcedure } from '../../index.js'

export const setlistRouter = {
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.db.select().from(setlistsTable)
    }),
}
