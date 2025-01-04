import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

export const permissionsTable = pgTable('permission', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    role: text('role', {
        enum: ['admin', 'host', 'guest'],
    }).notNull(),
})
