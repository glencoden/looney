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

export const SetlistSchema = createSelectSchema(setlistsTable)
export const SetlistInsertSchema = createInsertSchema(setlistsTable)
export const SongSchema = createSelectSchema(songsTable)
export const SongInsertSchema = createInsertSchema(songsTable)
export const SetlistToSongSchema = createSelectSchema(setlistsToSongsTable)
export const SetlistToSongInsertSchema =
    createInsertSchema(setlistsToSongsTable)

/**
 * Types
 */

export type Setlist = z.infer<typeof SetlistSchema>
export type SetlistInsert = z.infer<typeof SetlistInsertSchema>
export type Song = z.infer<typeof SongSchema>
export type SongInsert = z.infer<typeof SongInsertSchema>
export type SetlistToSong = z.infer<typeof SetlistToSongSchema>
export type SetlistToSongInsert = z.infer<typeof SetlistToSongInsertSchema>

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
