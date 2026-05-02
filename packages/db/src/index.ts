import { drizzle } from 'drizzle-orm/postgres-js'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { strict as assert } from 'node:assert'
import postgres from 'postgres'
import { z } from 'zod'
import { guestsTable as guestsSchema } from './schema/guestsTable.js'
import { lipsTable as lipsSchema } from './schema/lipsTable.js'
// TODO: remove with apps/cloud (Remix legacy)
import { permissionsTable as permissionsSchema } from './schema/permissionsTable.js'
import { sessionsTable as sessionsSchema } from './schema/sessionsTable.js'
import { setlistsTable as setlistsSchema } from './schema/setlistsTable.js'
import { setlistsToSongsTable as setlistsToSongsSchema } from './schema/setlistsToSongsTable.js'
import { songsTable as songsSchema } from './schema/songsTable.js'
import { authUserTable as authUserSchema } from './schema/authUserTable.js'
import { authSessionTable as authSessionSchema } from './schema/authSessionTable.js'
import { authAccountTable as authAccountSchema } from './schema/authAccountTable.js'
import { authVerificationTable as authVerificationSchema } from './schema/authVerificationTable.js'
/**
 * Table schema
 */

export const setlistsTable = setlistsSchema
export const songsTable = songsSchema
export const setlistsToSongsTable = setlistsToSongsSchema

export const sessionsTable = sessionsSchema
export const guestsTable = guestsSchema
export const lipsTable = lipsSchema

export const permissionsTable = permissionsSchema // TODO: remove with apps/cloud (Remix legacy)

export const authUserTable = authUserSchema
export const authSessionTable = authSessionSchema
export const authAccountTable = authAccountSchema
export const authVerificationTable = authVerificationSchema

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

export const SessionSchema = createSelectSchema(sessionsTable)
export const SessionInsertSchema = createInsertSchema(sessionsTable)
export const GuestSchema = createSelectSchema(guestsTable)
export const GuestInsertSchema = createInsertSchema(guestsTable)
export const LipSchema = createSelectSchema(lipsTable)
export const LipInsertSchema = createInsertSchema(lipsTable)

// TODO: remove with apps/cloud (Remix legacy)
export const PermissionSchema = createSelectSchema(permissionsTable)
export const PermissionInsertSchema = createInsertSchema(permissionsTable)

/**
 * Types
 */

export type Setlist = z.infer<typeof SetlistSchema>
export type SetlistInsert = z.infer<typeof SetlistInsertSchema>
export type Song = z.infer<typeof SongSchema>
export type SongInsert = z.infer<typeof SongInsertSchema>
export type SetlistToSong = z.infer<typeof SetlistToSongSchema>
export type SetlistToSongInsert = z.infer<typeof SetlistToSongInsertSchema>

export type Session = z.infer<typeof SessionSchema>
export type SessionInsert = z.infer<typeof SessionInsertSchema>
export type Guest = z.infer<typeof GuestSchema>
export type GuestInsert = z.infer<typeof GuestInsertSchema>
export type Lip = z.infer<typeof LipSchema>
export type LipInsert = z.infer<typeof LipInsertSchema>

// TODO: remove with apps/cloud (Remix legacy)
export type Permission = z.infer<typeof PermissionSchema>
export type PermissionInsert = z.infer<typeof PermissionInsertSchema>

export const AuthUserSchema = createSelectSchema(authUserTable)
export type AuthUser = typeof authUserTable.$inferSelect

export const AuthSessionSchema = createSelectSchema(authSessionTable)
export type AuthSession = typeof authSessionTable.$inferSelect

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
    authUserSchema,
    authSessionSchema,
    authAccountSchema,
    authVerificationSchema,
}

const databaseUrl = process.env.DATABASE_URL
const isNextBuild = process.env.NEXT_PHASE === 'phase-production-build'

const resolvedUrl = (() => {
    if (databaseUrl !== undefined) return databaseUrl
    if (isNextBuild) return 'postgres://build:build@localhost:5432/build'
    assert.fail('Database URL is required')
})()

const client = postgres(resolvedUrl, { prepare: false })

export const db = drizzle(client, { schema })
