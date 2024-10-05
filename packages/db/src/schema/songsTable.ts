import {
    boolean,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const songsTable = pgTable('song', {
    id: uuid('id').primaryKey().defaultRandom(),
    artist: varchar('artist', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    lyrics: text('lyrics').notNull(),
    isFavorite: boolean('is_favorite').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

export const SongSchema = createSelectSchema(songsTable)

export type Song = z.infer<typeof SongSchema>
