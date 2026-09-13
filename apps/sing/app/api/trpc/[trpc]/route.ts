import { createContext, trpcRouter } from '@repo/api/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) => {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: trpcRouter,
        createContext: (opts) =>
            createContext({
                req: opts.req,
                user: null,
            }),
    })
}

export { handler as GET, handler as POST }
