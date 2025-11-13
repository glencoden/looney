import { sql } from 'drizzle-orm'
import {
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'
import { guestsTable } from './guestsTable.js'
import { sessionsTable } from './sessionsTable.js'
import { songsTable } from './songsTable.js'

export const lipsTable = pgTable(
    'lip',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        sessionId: uuid('session_id')
            .notNull()
            .references(() => sessionsTable.id, { onDelete: 'cascade' }),
        songId: uuid('song_id')
            .notNull()
            .references(() => songsTable.id, { onDelete: 'cascade' }),
        guestId: uuid('guest_id')
            .notNull()
            .references(() => guestsTable.id, { onDelete: 'cascade' }),
        singerName: varchar('singer_name', { length: 255 }).notNull(),
        status: text('status', {
            enum: [
                'idle',
                'selected',
                'staged', // deprecated: this was imported from an old data set
                'no-show', // deprecated: this has the same display outcome as 'done' > we will track a no-show by timestamp
                'live',
                'done',
                'deleted',
            ],
        })
            .notNull()
            .default('idle'),
        sortNumber: integer('sort_number'),

        selectedAt: timestamp('selected_at', { withTimezone: true }),
        noShowAt: timestamp('no_show_at', { withTimezone: true }),
        liveAt: timestamp('live_at', { withTimezone: true }),
        doneAt: timestamp('done_at', { withTimezone: true }),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),

        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        sessionSortIdx: index('idx_lips_session_sort').on(
            table.sessionId,
            table.sortNumber,
        ),
        sessionStatusIdx: index('idx_lips_session_status').on(
            table.sessionId,
            table.status,
        ),
        statusLiveIdx: index('idx_lips_status_live')
            .on(table.status)
            .where(sql`status = 'live'`),
        guestIdx: index('idx_lips_guest').on(table.guestId),
    }),
)
