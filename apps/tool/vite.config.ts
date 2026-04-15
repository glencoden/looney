import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, type Plugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

async function readBody(req: IncomingMessage): Promise<Uint8Array | undefined> {
    if (req.method === 'GET' || req.method === 'HEAD') {
        return undefined
    }
    const chunks: Buffer[] = []
    for await (const chunk of req) {
        chunks.push(chunk as Buffer)
    }
    return new Uint8Array(Buffer.concat(chunks))
}

function trpcDev(): Plugin {
    return {
        name: 'tool-trpc-dev',
        async configureServer(server) {
            const [{ createContext, trpcRouter }, { fetchRequestHandler }] =
                await Promise.all([
                    import('@repo/api/server'),
                    import('@trpc/server/adapters/fetch'),
                ])

            async function handle(req: IncomingMessage, res: ServerResponse) {
                const host = req.headers.host ?? 'localhost'
                const url = `http://${host}${req.url ?? ''}`
                const headers = new Headers()
                for (const [key, value] of Object.entries(req.headers)) {
                    if (Array.isArray(value)) {
                        value.forEach((v) => headers.append(key, v))
                    } else if (value !== undefined) {
                        headers.set(key, String(value))
                    }
                }
                const body = await readBody(req)
                const request = new Request(url, {
                    method: req.method,
                    headers,
                    body: body as unknown as BodyInit | undefined,
                })
                const response = await fetchRequestHandler({
                    endpoint: '/api/trpc',
                    req: request,
                    router: trpcRouter,
                    createContext: (opts) =>
                        createContext({ req: opts.req, user: null }),
                })
                res.statusCode = response.status
                response.headers.forEach((value, key) =>
                    res.setHeader(key, value),
                )
                res.end(Buffer.from(await response.arrayBuffer()))
            }

            server.middlewares.use((req, res, next) => {
                if (!req.url?.startsWith('/api/trpc')) {
                    return next()
                }
                handle(req, res).catch(next)
            })
        },
    }
}

export default defineConfig({
    server: {
        port: 3003,
    },
    plugins: [react(), tailwindcss(), tsconfigPaths(), trpcDev()] as never,
})
