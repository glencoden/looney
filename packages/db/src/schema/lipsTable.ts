import {
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'
import { sessionsTable } from './sessionsTable.js'
import { songsTable } from './songsTable.js'

export const lipsTable = pgTable('lip', {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
        .notNull()
        .references(() => sessionsTable.id, { onDelete: 'cascade' }),
    songId: uuid('song_id')
        .notNull()
        .references(() => songsTable.id, { onDelete: 'cascade' }),
    guestId: varchar('guest_id', { length: 255 }).notNull(),
    singerName: varchar('singer_name', { length: 255 }).notNull(),
    status: text('status', {
        enum: ['pending', 'staged', 'live', 'done', 'deleted'],
    })
        .notNull()
        .default('pending'),
    sortNumber: integer('sort_number'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})
