import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { setlistsTable } from './schema/setlistsTable.js'

const schema = {
    setlistsTable
}

export const initDatabase = (connectionString: string) => {
    const client = postgres(connectionString, { prepare: false })

    return drizzle(client, { schema })
}