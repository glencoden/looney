import { SessionSchema } from '@repo/db'
import { getCurrentSession, getSession, updateSession } from '@repo/db/queries'
import { hostProcedure, publicProcedure } from '../../index.js'

export const sessionRouter = {
    get: publicProcedure
        .input(SessionSchema.pick({ id: true }))
        .query(({ input }) => {
            return getSession(input.id)
        }),

    getCurrent: publicProcedure.query(() => {
        return getCurrentSession()
    }),

    update: hostProcedure
        .input(
            SessionSchema.omit({ id: true })
                .partial()
                .extend({ id: SessionSchema.shape.id }),
        )
        .mutation(({ input }) => {
            return updateSession(input)
        }),
}
