import {
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core'
import { authUserTable } from './authUserTable.js'
import { sessionsTable } from './sessionsTable.js'

export const guestsTable = pgTable(
    'guest',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        sessionId: uuid('session_id').references(() => sessionsTable.id, {
            onDelete: 'cascade',
        }),
        internalId: text('internal_id').references(() => authUserTable.id),
        feedback: text('feedback'),
        tip: integer('tip').default(0),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        internalIdx: index('idx_guests_internal').on(table.internalId),
    }),
)
