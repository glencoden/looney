import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const setlistsTable = pgTable('setlist', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('slug', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})