import 'dotenv/config'
import { API_PORT } from '@repo/api'
import { trpcExpressAdapter } from '@repo/api/adapter'
import express from 'express'
import cors from 'cors'
import { strict as assert } from 'node:assert'

const databaseUrl = process.env.DATABASE_URL

assert(databaseUrl !== undefined, 'Database connection string is required')

const app = express()

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }))

app.use('/trpc', trpcExpressAdapter({ databaseUrl }))

app.get('/', (_req, res) => {
    res.send('Glen was here.')
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))
