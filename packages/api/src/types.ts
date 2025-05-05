import { RouterOutputs } from './trpc/router/index.js'

export type LipDTO =
    | NonNullable<RouterOutputs['lip']['getBySessionId']>[number]
    | NonNullable<RouterOutputs['lip']['getByGuestId']>[number]
