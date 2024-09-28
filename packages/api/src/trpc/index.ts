import { initTRPC } from '@trpc/server'
import type * as trpcExpress from '@trpc/server/adapters/express'
import { ZodError } from 'zod'
import { initDatabase } from '../db/index.js'

export const initCreateContext = (databaseUrl: string) => {
    const db = initDatabase(databaseUrl)

    return ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
        return { db }
    }
}

type Context = Awaited<ReturnType<ReturnType<typeof initCreateContext>>>

const t = initTRPC.context<Context>().create({
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
