import 'dotenv/config'
import express from 'express'
import TelegramBot from 'node-telegram-bot-api'
import { db } from './db'
import { setlistsTable } from './db/schema/setlistsTable'
import cors from 'cors'

const API_PORT = 5001

const app = express()

app.options('*', cors())
app.use(cors())

app.get('/', async (_req, res) => {
    const setlists = await db.select().from(setlistsTable)

    res.json({ setlists })
})

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: true,
})

telegramBot.on('message', (message) => {
    console.log(message)
})

app.get('/telegram', (_req, res) => {
    void telegramBot.sendMessage(process.env.LOONEY_CHAT_ID!, 'glen was here')

    res.send('Telegram message sent.')
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}.`))
