import { createTRPCReact } from '@trpc/react-query'
import type { TRPCRouter } from '../router/index.js'

export const api = createTRPCReact<TRPCRouter>()