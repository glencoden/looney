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
    getLiveLipBySessionId,
    moveLip,
    updateLip,
} from '@repo/db/queries'
import { protectedProcedure, publicProcedure } from '../../index.js'

export const lipRouter = {
    getByGuestId: publicProcedure
        .input(GuestSchema.pick({ id: true }))
        .query(({ input }) => {
            return getLipsByGuestId(input.id)
        }),

    getBySessionId: publicProcedure
        .input(SessionSchema.pick({ id: true }))
        .query(({ input }) => {
            return getLipsBySessionId(input.id)
        }),

    getLiveBySessionId: publicProcedure
        .input(SessionSchema.pick({ id: true }))
        .query(({ input }) => {
            return getLiveLipBySessionId(input.id)
        }),

    create: publicProcedure.input(LipInsertSchema).mutation(({ input }) => {
        return createLip(input)
    }),

    update: protectedProcedure
        .input(
            LipSchema.omit({ id: true })
                .partial()
                .extend({ id: LipSchema.shape.id }),
        )
        .mutation(({ input }) => {
            return updateLip(input)
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
        .mutation(async ({ input }) => {
            const preLipMove = performance.now()
            const result = await moveLip(input)
            console.log(
                'LIP MOVED IN:',
                Math.round(performance.now() - preLipMove),
            )
            return result
        }),

    createDemo: protectedProcedure
        .input(SessionSchema.pick({ id: true }))
        .mutation(({ input }) => {
            return createDemoLip(input.id)
        }),
}
