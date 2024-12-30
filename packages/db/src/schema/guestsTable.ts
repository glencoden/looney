import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sessionsTable } from './sessionsTable.js'

export const guestsTable = pgTable('guest', {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id').references(() => sessionsTable.id, {
        onDelete: 'cascade',
    }),
    feedback: text('feedback'),
    tip: integer('tip').default(0),
    createdAt: timestamp('created_at').defaultNow(),
})
