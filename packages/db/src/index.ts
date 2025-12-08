import { drizzle } from 'drizzle-orm/postgres-js'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { strict as assert } from 'node:assert'
import postgres from 'postgres'
import { z } from 'zod'
import {
    authAccountRelations,
    authAccountTable as authAccountSchema,
} from './schema/authAccountTable.js'
import {
    authSessionRelations,
    authSessionTable as authSessionSchema,
} from './schema/authSessionTable.js'
import {
    authUserRelations,
    authUserTable as authUserSchema,
} from './schema/authUserTable.js'
import { authVerificationTable as authVerificationSchema } from './schema/authVerificationTable.js'
import { guestsTable as guestsSchema } from './schema/guestsTable.js'
import { lipsTable as lipsSchema } from './schema/lipsTable.js'
import { permissionsTable as permissionsSchema } from './schema/permissionsTable.js'
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

export const permissionsTable = permissionsSchema

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

export const PermissionSchema = createSelectSchema(permissionsTable)
export const PermissionInsertSchema = createInsertSchema(permissionsTable)

export const AuthUserSchema = createSelectSchema(authUserTable)
export const AuthUserInsertSchema = createInsertSchema(authUserTable)
export const AuthSessionSchema = createSelectSchema(authSessionTable)
export const AuthSessionInsertSchema = createInsertSchema(authSessionTable)
export const AuthAccountSchema = createSelectSchema(authAccountTable)
export const AuthAccountInsertSchema = createInsertSchema(authAccountTable)
export const AuthVerificationSchema = createSelectSchema(authVerificationTable)
export const AuthVerificationInsertSchema = createInsertSchema(
    authVerificationTable,
)

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

export type Permission = z.infer<typeof PermissionSchema>
export type PermissionInsert = z.infer<typeof PermissionInsertSchema>

export type AuthUser = z.infer<typeof AuthUserSchema>
export type AuthUserInsert = z.infer<typeof AuthUserInsertSchema>
export type AuthSession = z.infer<typeof AuthSessionSchema>
export type AuthSessionInsert = z.infer<typeof AuthSessionInsertSchema>
export type AuthAccount = z.infer<typeof AuthAccountSchema>
export type AuthAccountInsert = z.infer<typeof AuthAccountInsertSchema>
export type AuthVerification = z.infer<typeof AuthVerificationSchema>
export type AuthVerificationInsert = z.infer<
    typeof AuthVerificationInsertSchema
>

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
    authUserRelations,
    authSessionRelations,
    authAccountRelations,
}

const databaseUrl = process.env.DATABASE_URL

assert(databaseUrl !== undefined, 'Database URL is required')

const client = postgres(databaseUrl, { prepare: false })

export const db = drizzle(client, { schema })
