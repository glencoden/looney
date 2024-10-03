import { SupabaseClient } from '@supabase/supabase-js'
import { initTRPC, TRPCError } from '@trpc/server'
import type * as trpcExpress from '@trpc/server/adapters/express'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { initDatabase } from '../db/index.js'

export type InitCreateContextParams = Readonly<{
    databaseUrl: string
    supabaseClient: SupabaseClient
}>

export const initCreateContext = ({
    databaseUrl,
    supabaseClient,
}: InitCreateContextParams) => {
    const db = initDatabase(databaseUrl)

    return async ({ req }: trpcExpress.CreateExpressContextOptions) => {
        const accessToken = req.headers['authorization']?.replace('Bearer ', '')

        if (!accessToken) {
            return { db, user: null }
        }

        const { data, error } = await supabaseClient.auth.getUser(accessToken)

        if (error) {
            throw new Error(error.message)
        }

        return { db, user: data.user }
    }
}

type Context = Awaited<ReturnType<ReturnType<typeof initCreateContext>>>

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        }
    },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
        ctx: {
            user: ctx.user, // infers non-optional values of the `user` as non-nullable
        },
    })
})
