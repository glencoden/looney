import { relations } from 'drizzle-orm'
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { authUserTable } from './authUserTable.js'

export const authSessionTable = pgTable(
    'user_session',
    {
        id: text('id').primaryKey(),
        expiresAt: timestamp('expires_at').notNull(),
        token: text('token').notNull().unique(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        userId: text('user_id')
            .notNull()
            .references(() => authUserTable.id, { onDelete: 'cascade' }),
    },
    (table) => [index('user_session_userId_idx').on(table.userId)],
)

export const authSessionRelations = relations(authSessionTable, ({ one }) => ({
    user: one(authUserTable, {
        fields: [authSessionTable.userId],
        references: [authUserTable.id],
    }),
}))
