import { API_PORT } from '@repo/api'
import { trpcExpressAdapter } from '@repo/api/adapter'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

const app = express()

app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
        ],
        credentials: true,
    }),
)

app.use(cookieParser())

app.use('/trpc', trpcExpressAdapter)

app.get('/', (_req, res) => {
    res.send('Hello from the Looney Cloud API server.')
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))
