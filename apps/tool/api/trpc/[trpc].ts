import { createContext, trpcRouter } from '@repo/api/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

export default function handler(
    req: Request,
): Response | Promise<Response> {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: trpcRouter,
        createContext: (opts) => createContext({ req: opts.req, user: null }),
    })
}
