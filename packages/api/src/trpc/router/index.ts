import type { inferReactQueryProcedureOptions } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { createTRPCRouter } from '../index.js'
import { setlistRouter } from './setlist/setlistRouter.js'
import { songRouter } from './song/songRouter.js'

export type TRPCRouter = typeof trpcRouter
export type ReactQueryOptions = inferReactQueryProcedureOptions<TRPCRouter>
export type RouterInputs = inferRouterInputs<TRPCRouter>
export type RouterOutputs = inferRouterOutputs<TRPCRouter>

export const trpcRouter = createTRPCRouter({
    setlist: setlistRouter,
    song: songRouter,
})
