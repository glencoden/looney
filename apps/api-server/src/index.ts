import { API_PORT } from '@repo/api'
import { trpcExpressAdapter } from '@repo/api/adapter'
import assert from 'assert'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

assert(process.env.API_CORS_ORIGIN, 'API_CORS_ORIGIN is not set')

const app = express()

app.use(
    cors({
        origin: process.env.API_CORS_ORIGIN.split(','),
        credentials: true,
    }),
)

app.use(cookieParser())

app.use('/trpc', trpcExpressAdapter)

app.get('/', (_req, res) => {
    res.send('Hello from the Looney Cloud API server.')
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))
