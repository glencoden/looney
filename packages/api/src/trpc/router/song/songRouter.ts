import { SongSchema } from '@repo/db'
import { getSong, getSongs } from '@repo/db/queries'
import { publicProcedure } from '../../index.js'

export const songRouter = {
    getAll: publicProcedure.query(() => {
        return getSongs()
    }),

    getAllWithLyrics: publicProcedure.query(() => {
        return getSongs(null, true, true)
    }),

    getById: publicProcedure
        .input(SongSchema.pick({ id: true }))
        .query(({ input }) => {
            return getSong(input.id)
        }),
}
