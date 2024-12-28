import { drizzle } from 'drizzle-orm/postgres-js'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { strict as assert } from 'node:assert'
import postgres from 'postgres'
import { z } from 'zod'
import { guestsTable as guestsSchema } from './schema/guestsTable.js'
import { lipsTable as lipsSchema } from './schema/lipsTable.js'
import { sessionsTable as sessionsSchema } from './schema/sessionsTable.js'
import { setlistsTable as setlistsSchema } from './schema/setlistsTable.js'
import { setlistsToSongsTable as setlistsToSongsSchema } from './schema/setlistsToSongsTable.js'
import { songsTable as songsSchema } from './schema/songsTable.js'

/**
 * Table schema
 */

export const setlistsTable = setlistsSchema
export const songsTable = songsSchema
export const setlistsToSongsTable = setlistsToSongsSchema
export const sessionsTable = sessionsSchema
export const guestsTable = guestsSchema
export const lipsTable = lipsSchema

/**
 * Zod schema
 */

export const SongSchema = createSelectSchema(songsTable)
export const SongInsertSchema = createInsertSchema(songsTable)

/**
 * Types
 */

export type Song = z.infer<typeof SongSchema>
export type SongInsert = z.infer<typeof SongInsertSchema>

/**
 * Database client
 */

const schema = {
    setlistsSchema,
    songsSchema,
    setlistsToSongsSchema,
    sessionsSchema,
    guestsSchema,
    lipsSchema,
}

const databaseUrl = process.env.DATABASE_URL

assert(databaseUrl !== undefined, 'Database URL is required')

const client = postgres(databaseUrl, { prepare: false })

export const db = drizzle(client, { schema })
