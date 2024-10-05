import { drizzle } from 'drizzle-orm/postgres-js'
import { strict as assert } from 'node:assert'
import postgres from 'postgres'
import { lipsTable as lipsSchema } from './schema/lipsTable.js'
import { sessionsTable as sessionsSchema } from './schema/sessionsTable.js'
import { setlistsTable as setlistsSchema } from './schema/setlistsTable.js'
import { setlistsToSongsTable as setlistsToSongsSchema } from './schema/setlistsToSongsTable.js'
import { songsTable as songsSchema } from './schema/songsTable.js'

const databaseUrl = process.env.DATABASE_URL

assert(databaseUrl !== undefined, 'Database URL is required')

export const setlistsTable = setlistsSchema
export const songsTable = songsSchema
export const setlistsToSongsTable = setlistsToSongsSchema
export const sessionsTable = sessionsSchema
export const lipsTable = lipsSchema

const schema = {
    setlistsSchema,
    songsSchema,
    setlistsToSongsSchema,
    sessionsSchema,
    lipsSchema,
}

const client = postgres(databaseUrl, { prepare: false })

export const db = drizzle(client, { schema })
