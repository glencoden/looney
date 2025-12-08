import {
    authAccountTable,
    authSessionTable,
    authUserTable,
    authVerificationTable,
    db,
} from '@repo/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

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
    session: {
        modelName: 'user_session',
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
})
