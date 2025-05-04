import { createContext } from '@repo/api'
import { trpcRouter } from '@repo/api/router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

export default function handler(request: Request) {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req: request,
        router: trpcRouter,
        createContext,
    })
}
