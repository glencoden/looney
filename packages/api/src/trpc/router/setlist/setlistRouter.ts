import { setlistsTable } from '@repo/db'
import { protectedProcedure } from '../../index.js'

export const setlistRouter = {
    get: protectedProcedure.query(({ ctx }) => {
        return ctx.db.select().from(setlistsTable)
    }),
}
