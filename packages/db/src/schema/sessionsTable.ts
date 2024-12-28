import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const sessionsTable = pgTable('session', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    setlistId: uuid('setlist_id').notNull(),
    isDemo: boolean('is_demo').default(false),
    isLocked: boolean('is_locked').default(false),
    hasTipCollection: boolean('has_tip_collection').default(false),
    startsAt: timestamp('starts_at'),
    endsAt: timestamp('ends_at'),
    createdAt: timestamp('created_at').defaultNow(),
})
