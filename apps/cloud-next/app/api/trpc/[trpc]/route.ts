import { auth } from '~/lib/auth'
import { createContext, trpcRouter } from '@repo/api/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = async (req: Request) => {
    const session = await auth.api.getSession({ headers: req.headers })

    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: trpcRouter,
        createContext: (opts) =>
            createContext({
                req: opts.req,
                user: session?.user
                    ? {
                          id: session.user.id,
                          email: session.user.email,
                          name: session.user.name,
                          image: session.user.image ?? null,
                      }
                    : null,
            }),
    })
}

export { handler as GET, handler as POST }
