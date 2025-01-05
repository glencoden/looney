import { GuestSchema } from '@repo/db'
import { createGuest, getGuest, updateGuest } from '@repo/db/queries'
import { TRPCRouterRecord } from '@trpc/server'
import { publicProcedure } from '../../index.js'

export const guestRouter = {
    get: publicProcedure
        .input(GuestSchema.pick({ id: true }))
        .query(({ input }) => {
            return getGuest(input.id)
        }),

    create: publicProcedure.mutation(() => {
        return createGuest()
    }),

    update: publicProcedure
        .input(
            GuestSchema.omit({ id: true, createdAt: true }).partial().extend({
                id: GuestSchema.shape.id,
            }),
        )
        .mutation(({ input }) => {
            return updateGuest(input)
        }),
} as TRPCRouterRecord
