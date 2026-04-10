import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { authUserTable } from './authUserTable.js'

export const authSessionTable = pgTable(
    'user_session',
    {
        id: text('id').primaryKey(),
        expiresAt: timestamp('expires_at').notNull(),
        token: text('token').notNull().unique(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        userId: text('user_id')
            .notNull()
            .references(() => authUserTable.id, { onDelete: 'cascade' }),
    },
    (table) => ({
        userIdIdx: index('user_session_userId_idx').on(table.userId),
    }),
)
