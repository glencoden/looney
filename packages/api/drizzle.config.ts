import type { Config } from 'drizzle-kit'

export default {
    schema: './src/db/schema/*',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
} satisfies Config
