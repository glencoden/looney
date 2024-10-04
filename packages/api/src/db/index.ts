import { drizzle } from 'drizzle-orm/postgres-js'
import { strict as assert } from 'node:assert'
import postgres from 'postgres'
import { setlistsTable } from './schema/setlistsTable.js'

const databaseUrl = process.env.DATABASE_URL

assert(databaseUrl !== undefined, 'Database URL is required')

const schema = {
    setlistsTable,
}

const client = postgres(databaseUrl, { prepare: false })

export const db = drizzle(client, { schema })
