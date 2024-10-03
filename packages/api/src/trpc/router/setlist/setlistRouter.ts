import { setlistsTable } from '../../../db/schema/setlistsTable.js'
import { protectedProcedure } from '../../index.js'

export const setlistRouter = {
    get: protectedProcedure.query(({ ctx }) => {
        return ctx.db.select().from(setlistsTable)
    }),
}
