import {
    boolean,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'
import { setlistsTable } from './setlistsTable.js'

export const songsTable = pgTable('song', {
    id: uuid('id').primaryKey().defaultRandom(),
    setlistId: uuid('setlist_id')
        .notNull()
        .references(() => setlistsTable.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    lyrics: text('lyrics').notNull(),
    isFavorite: boolean('is_favorite').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})
