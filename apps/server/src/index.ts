import { API_PORT } from '@repo/api'
import { trpcExpressAdapter } from '@repo/api/adapter'
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }))

app.use('/trpc', trpcExpressAdapter)

app.get('/', (_req, res) => {
    res.send('Glen was here.')
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))