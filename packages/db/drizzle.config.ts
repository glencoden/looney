import type { Config } from 'drizzle-kit'

export default {
    schema: './dist/schema/**/*.{js,ts}',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
} satisfies Config
