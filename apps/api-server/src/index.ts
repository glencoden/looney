import { API_PORT } from '@repo/api'
import { trpcExpressAdapter } from '@repo/api/adapter'
import { createClient } from '@supabase/supabase-js'
import express from 'express'
import cors from 'cors'
import { strict as assert } from 'node:assert'
import cookieParser from 'cookie-parser'

/**
 * Environment variables
 */

if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv')
    dotenv.config({ path: '../../.env' })
}

const databaseUrl = process.env.DATABASE_URL
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

assert(databaseUrl !== undefined, 'Database URL is required')
assert(supabaseUrl !== undefined, 'Supabase URL is required')
assert(supabaseAnonKey !== undefined, 'Supabase anon key is required')

/**
 * Lib
 */

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Server
 */

const app = express()

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

app.use(cookieParser())

app.use('/trpc', trpcExpressAdapter({ databaseUrl, supabaseClient: supabase }))

app.get('/', (_req, res) => {
    res.send('Glen was here.')
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))
