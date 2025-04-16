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
import { z } from 'zod'
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
            z.array(
                LipSchema.pick({
                    id: true,
                    status: true,
                    sortNumber: true,
                }),
            ),
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
