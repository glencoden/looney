import { RouterOutputs } from './trpc/router/index.js'

export const API_PORT = 5555

export type LipDTO =
    | NonNullable<RouterOutputs['lip']['getBySessionId']>[number]
    | NonNullable<RouterOutputs['lip']['getByGuestId']>[number]
