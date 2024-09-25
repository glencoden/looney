import { setlistsTable } from '../../../db/schema/setlistsTable.js'
import { publicProcedure } from '../../index.js'

export const setlistRouter = {
    get: publicProcedure.query(({ ctx }) => {
        return ctx.db.select().from(setlistsTable)
    }),
}