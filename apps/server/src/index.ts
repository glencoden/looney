import { API_PORT, createContext } from '@repo/api/adapter'
import { appRouter } from '@repo/api/router'
import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import cors from 'cors'

const app = express()

app.options('*', cors())

app.use(cors())

app.get('/', (_req, res) => {
    res.send('Hello, world!')
})

app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
}))

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))