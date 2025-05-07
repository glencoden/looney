import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { createContext, trpcRouter } from '@repo/api/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

export const loader = async (args: LoaderFunctionArgs) => {
    return handleRequest(args)
}

export const action = async (args: ActionFunctionArgs) => {
    return handleRequest(args)
}

function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req: args.request,
        router: trpcRouter,
        createContext,
    })
}
