import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { setlistsTable } from './setlistsTable.js'
import { songsTable } from './songsTable.js'

export const setlistsToSongsTable = pgTable(
    'setlist_to_song',
    {
        setlistId: uuid('setlist_id')
            .notNull()
            .references(() => setlistsTable.id, { onDelete: 'cascade' }),
        songId: uuid('song_id')
            .notNull()
            .references(() => songsTable.id, { onDelete: 'cascade' }),
    },
    (table) => ({
        compoundKey: primaryKey({
            columns: [table.setlistId, table.songId],
        }),
    }),
)
