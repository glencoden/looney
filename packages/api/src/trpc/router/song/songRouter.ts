import { getSongs } from '@repo/db/queries'
import { publicProcedure } from '../../index.js'

export const songRouter = {
    getAll: publicProcedure.query(() => {
        return getSongs()
    }),

    getAllWithLyrics: publicProcedure.query(() => {
        return getSongs(true)
    }),
}
