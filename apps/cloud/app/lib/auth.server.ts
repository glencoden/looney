import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import {
    db,
    authUserTable,
    authSessionTable,
    authAccountTable,
    authVerificationTable,
} from '@repo/db'
import { strict as assert } from 'node:assert'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

assert(googleClientId !== undefined, 'GOOGLE_CLIENT_ID is required')
assert(googleClientSecret !== undefined, 'GOOGLE_CLIENT_SECRET is required')

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: authUserTable,
            session: authSessionTable,
            account: authAccountTable,
            verification: authVerificationTable,
        },
    }),
    socialProviders: {
        google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        },
    },
})
