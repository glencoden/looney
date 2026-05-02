import 'server-only'
import {
    authAccountTable,
    authSessionTable,
    authUserTable,
    authVerificationTable,
    db,
} from '@repo/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'

const required = (name: string): string => {
    const value = process.env[name]
    if (value === undefined || value === '') {
        throw new Error(`${name} is required`)
    }
    return value
}

export const auth = betterAuth({
    secret: required('BETTER_AUTH_SECRET'),
    baseURL: required('BETTER_AUTH_URL'),
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
            clientId: required('GOOGLE_CLIENT_ID'),
            clientSecret: required('GOOGLE_CLIENT_SECRET'),
        },
    },
    plugins: [nextCookies()],
})
