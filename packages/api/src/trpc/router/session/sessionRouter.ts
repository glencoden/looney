import { SessionSchema } from '@repo/db'
import { getCurrentSession, getSession, updateSession } from '@repo/db/queries'
import { protectedProcedure, publicProcedure } from '../../index.js'

export const sessionRouter = {
    get: publicProcedure
        .input(SessionSchema.pick({ id: true }))
        .query(({ input }) => {
            return getSession(input.id)
        }),

    getCurrent: publicProcedure.query(() => {
        return getCurrentSession()
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
