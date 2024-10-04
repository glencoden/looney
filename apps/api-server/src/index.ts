import { API_PORT } from '@repo/api'
import { trpcExpressAdapter } from '@repo/api/adapter'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

app.use(cookieParser())

app.use('/trpc', trpcExpressAdapter)

app.get('/', (_req, res) => {
    res.send('Hello from the Looney Cloud API server.')
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))
