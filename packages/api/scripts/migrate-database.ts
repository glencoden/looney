import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { strict as assert } from 'node:assert'
// @ts-ignore
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL

assert(connectionString !== undefined, 'Database connection string is required')

const client = postgres(connectionString, { prepare: false, max: 1 })

const db = drizzle(client)

async function main() {
    await migrate(db, { migrationsFolder: 'migrations' })

    await client.end()
}

void main()
