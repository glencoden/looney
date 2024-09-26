import * as trpcExpress from '@trpc/server/adapters/express'
import { initCreateContext } from '../index.js'
import { trpcRouter } from '../router/index.js'

export const trpcExpressAdapter = ({ databaseUrl }: Readonly<{
    databaseUrl: string
}>) => {
    const createContext = initCreateContext(databaseUrl)

    return trpcExpress.createExpressMiddleware({
        router: trpcRouter,
        createContext,
    })
}