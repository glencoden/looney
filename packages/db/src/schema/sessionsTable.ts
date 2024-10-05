import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const sessionsTable = pgTable('session', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    eventPlace: varchar('event_place', { length: 255 }),
    eventDate: timestamp('event_date'),
    calendarEventId: varchar('calendar_event_id', { length: 255 }),
    startsAt: timestamp('starts_at'),
    createdAt: timestamp('created_at').defaultNow(),
})
