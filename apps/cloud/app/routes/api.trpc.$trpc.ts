import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { createContext, trpcRouter } from '@repo/api/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { auth } from '~/lib/auth.server'

export const loader = async (args: LoaderFunctionArgs) => {
    return handleRequest(args)
}

export const action = async (args: ActionFunctionArgs) => {
    return handleRequest(args)
}

async function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
    const session = await auth.api.getSession({
        headers: args.request.headers,
    })

    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req: args.request,
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
