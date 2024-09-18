import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { ZodError } from 'zod'

export const API_PORT = 5555

export const createContext = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => {
    return {}
}

type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        }
    },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure
