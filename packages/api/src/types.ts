import { RouterOutputs } from './trpc/router/index.js'

/**
 * This doesn't include the return type of `getLiveLipBySessionId`, because the latter is used in the tool for auto screen detection only
 */
export type LipDTO =
    | NonNullable<RouterOutputs['lip']['getBySessionId']>[number]
    | NonNullable<RouterOutputs['lip']['getByGuestId']>[number]
