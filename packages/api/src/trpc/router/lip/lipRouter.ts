import {
    GuestSchema,
    LipInsertSchema,
    LipSchema,
    SessionSchema,
} from '@repo/db'
import {
    createDemoLip,
    createLip,
    getLipsByGuestId,
    getLipsBySessionId,
    moveLip,
} from '@repo/db/queries'
import { protectedProcedure, publicProcedure } from '../../index.js'

export const lipRouter = {
    getBySessionId: protectedProcedure
        .input(SessionSchema.pick({ id: true }))
        .query(({ input }) => {
            return getLipsBySessionId(input.id)
        }),

    getByGuestId: publicProcedure
        .input(GuestSchema.pick({ id: true }))
        .query(({ input }) => {
            return getLipsByGuestId(input.id)
        }),

    create: publicProcedure.input(LipInsertSchema).mutation(({ input }) => {
        return createLip(input)
    }),

    move: protectedProcedure
        .input(
            LipSchema.omit({ id: true }).partial().extend({
                id: LipSchema.shape.id,
                sessionId: LipInsertSchema.shape.sessionId,
                status: LipSchema.shape.status,
                sortNumber: LipSchema.shape.sortNumber,
            }),
        )
        .mutation(({ input }) => {
            return moveLip(input)
        }),

    createDemo: protectedProcedure
        .input(SessionSchema.pick({ id: true }))
        .mutation(({ input }) => {
            return createDemoLip(input.id)
        }),
}
