import * as trpcExpress from '@trpc/server/adapters/express'
import { createContext } from '../index.js'
import { trpcRouter } from '../router/index.js'

export const trpcExpressAdapter = trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext,
})