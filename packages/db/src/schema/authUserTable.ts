import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { authAccountTable } from './authAccountTable.js'
import { authSessionTable } from './authSessionTable.js'

export const authUserTable = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})

export const authUserRelations = relations(authUserTable, ({ many }) => ({
    sessions: many(authSessionTable),
    accounts: many(authAccountTable),
}))
