import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { strict as assert } from 'node:assert'
import postgres from 'postgres'
import { setlistsTable } from './schema/setlistsTable'

const connectionString = process.env.DATABASE_URL

assert(connectionString !== undefined, 'Database connection string is required')

const schema = {
    setlistsTable
}

export const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })