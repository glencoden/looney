import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { PERMISSION_ROLES } from '../permission.js'

export const authUserTable = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: text('image'),
    permissionRole: text('permission_role', { enum: PERMISSION_ROLES })
        .notNull()
        .default('user'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
