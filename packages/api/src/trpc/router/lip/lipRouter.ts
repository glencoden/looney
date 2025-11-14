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
            z.object({
                lips: z.array(
                    LipSchema.pick({
                        id: true,
                        status: true,
                        sortNumber: true,
                    }),
                ),
                movedLip: LipSchema.pick({
                    id: true,
                    status: true,
                }),
            }),
        )
        .mutation(({ input }) => {
            return moveLip(input.lips, input.movedLip)
        }),

    createDemo: protectedProcedure
        .input(LipInsertSchema.pick({ sessionId: true, songId: true }))
        .mutation(({ input, ctx }) => {
            const email = ctx.user.email
            if (!email) {
                throw new Error(
                    'The user trying to create a demo lip has no email',
                )
            }
            return createDemoLip({
                email,
                ...input,
            })
        }),
}
