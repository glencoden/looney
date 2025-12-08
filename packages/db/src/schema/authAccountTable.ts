import { relations } from 'drizzle-orm'
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { authUserTable } from './authUserTable.js'

export const authAccountTable = pgTable(
    'account',
    {
        id: text('id').primaryKey(),
        accountId: text('account_id').notNull(),
        providerId: text('provider_id').notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => authUserTable.id, { onDelete: 'cascade' }),
        accessToken: text('access_token'),
        refreshToken: text('refresh_token'),
        idToken: text('id_token'),
        accessTokenExpiresAt: timestamp('access_token_expires_at'),
        refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
        scope: text('scope'),
        password: text('password'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index('account_userId_idx').on(table.userId)],
)

export const authAccountRelations = relations(authAccountTable, ({ one }) => ({
    user: one(authUserTable, {
        fields: [authAccountTable.userId],
        references: [authUserTable.id],
    }),
}))
