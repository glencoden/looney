import { createContext, trpcRouter } from '@repo/api/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

export default function handler(
    req: Request,
): Response | Promise<Response> {
    const host = req.headers.get('host') ?? 'localhost'
    const proto = req.headers.get('x-forwarded-proto') ?? 'https'
    const absUrl = new URL(req.url, `${proto}://${host}`).toString()
    const absReq = new Request(absUrl, req)
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req: absReq,
        router: trpcRouter,
        createContext: (opts) => createContext({ req: opts.req, user: null }),
    })
}
