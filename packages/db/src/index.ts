import { drizzle } from 'drizzle-orm/postgres-js'
import { strict as assert } from 'node:assert'
import postgres from 'postgres'
import { lipsTable as lipsSchema } from './schema/lipsTable.js'
import { sessionsTable as sessionsSchema } from './schema/sessionsTable.js'
import { setlistsTable as setlistsSchema } from './schema/setlistsTable.js'
import { songsTable as songsSchema } from './schema/songsTable.js'

const databaseUrl = process.env.DATABASE_URL

assert(databaseUrl !== undefined, 'Database URL is required')

export const lipsTable = lipsSchema
export const sessionsTable = sessionsSchema
export const setlistsTable = setlistsSchema
export const songsTable = songsSchema

const schema = {
    lipsSchema,
    sessionsSchema,
    setlistsSchema,
    songsSchema,
}

const client = postgres(databaseUrl, { prepare: false })

export const db = drizzle(client, { schema })
