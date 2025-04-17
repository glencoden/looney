import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const sessionsTable = pgTable('session', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    setlistId: uuid('setlist_id').notNull(),
    isDemo: boolean('is_demo').default(false),
    isLocked: boolean('is_locked').default(false),
    hideFavorites: boolean('hide_favorites').default(false),
    hideTipCollection: boolean('hide_tip_collection').default(false),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
