import { API_PORT } from '@repo/api'
import { trpcExpressAdapter } from '@repo/api/adapter'
import assert from 'assert'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { contactFormRouter } from './router/contactForm.js'
import { googleCalendarRouter } from './router/googleCalendar.js'

assert(process.env.API_CORS_ORIGIN, 'Expect API_CORS_ORIGIN to be set.')

const app = express()

app.use(
    cors({
        origin: process.env.API_CORS_ORIGIN.split(','),
        credentials: true,
    }),
)

app.use(cookieParser())
app.use(bodyParser.json({ limit: '1mb' }))

app.use('/calendar', googleCalendarRouter)
app.use('/contact', contactFormRouter)
app.use('/trpc', trpcExpressAdapter)

app.get('/', (_req, res) => {
    res.send('Hello from the Looney Cloud API server.')
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))
