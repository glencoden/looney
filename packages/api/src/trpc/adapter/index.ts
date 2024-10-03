import * as trpcExpress from '@trpc/server/adapters/express'
import { initCreateContext, InitCreateContextParams } from '../index.js'
import { trpcRouter } from '../router/index.js'

export const trpcExpressAdapter = (params: InitCreateContextParams) => {
    const createContext = initCreateContext(params)

    return trpcExpress.createExpressMiddleware({
        router: trpcRouter,
        createContext,
    })
}
