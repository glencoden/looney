import { SessionSchema } from '@repo/db'
import { getCurrentSession, getSession, updateSession } from '@repo/db/queries'
import { z } from 'zod'
import { protectedProcedure, publicProcedure } from '../../index.js'

export const sessionRouter = {
    get: publicProcedure
        .input(SessionSchema.pick({ id: true }))
        .query(({ input }) => {
            return getSession(input.id)
        }),

    getCurrent: publicProcedure
        .input(
            z
                .object({
                    includeDemo: z.boolean(),
                })
                .optional(),
        )
        .query(({ input }) => {
            return getCurrentSession(input?.includeDemo)
        }),

    update: protectedProcedure
        .input(
            SessionSchema.omit({ id: true })
                .partial()
                .extend({ id: SessionSchema.shape.id }),
        )
        .mutation(({ input }) => {
            return updateSession(input)
        }),
}
