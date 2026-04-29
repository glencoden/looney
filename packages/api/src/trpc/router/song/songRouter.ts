import { SongSchema } from '@repo/db'
import { getSong, getSongs } from '@repo/db/queries'
import { z } from 'zod'
import { publicProcedure } from '../../index.js'

export const songRouter = {
    getAll: publicProcedure
        .input(z.object({ q: z.string().nullable().optional() }).optional())
        .query(({ input }) => {
            return getSongs(input?.q ?? null)
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
