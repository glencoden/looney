import { db } from '@repo/db'
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { supabase } from '../lib/supabase.js'

export const createContext = async (opts: { req: Request }) => {
    const accessToken = opts.req.headers
        .get('authorization')
        ?.replace('Bearer ', '')

    if (!accessToken) {
        return { db, user: null }
    }

    const { data, error } = await supabase.auth.getUser(accessToken)

    if (error) {
        throw new Error(error.message)
    }

    return { db, user: data.user }
}

type Context = Awaited<ReturnType<typeof createContext>>

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
