import { createContext, trpcRouter } from '@repo/api/server'
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http'
import type { IncomingMessage, ServerResponse } from 'node:http'

export default async function handler(
    req: IncomingMessage,
    res: ServerResponse,
): Promise<void> {
    const host = req.headers.host ?? 'localhost'
    const xfp = req.headers['x-forwarded-proto']
    const proto =
        (Array.isArray(xfp) ? xfp[0] : xfp) ?? 'https'
    const url = new URL(req.url ?? '/', `${proto}://${host}`)

    await nodeHTTPRequestHandler({
        path: url.pathname.replace(/^\/api\/trpc\//, ''),
        req,
        res,
        router: trpcRouter,
        createContext: () =>
            createContext({
                req: new Request(url, { method: req.method }),
                user: null,
            }),
    })
}
