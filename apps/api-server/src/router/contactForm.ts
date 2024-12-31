import assert from 'assert'
import { Router } from 'express'
import TelegramBot from 'node-telegram-bot-api'

assert(process.env.TELEGRAM_BOT_TOKEN, 'Expect TELEGRAM_BOT_TOKEN to be set.')
assert(process.env.LOONEY_CHAT_IDS, 'Expect LOONEY_CHAT_IDS to be set.')

const CHAT_IDS = process.env.LOONEY_CHAT_IDS.split(',')

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
    polling: true,
})

telegramBot.on('message', (message) => {
    console.log('MESSAGE RECEIVED BY TELEGRAM BOT:')
    console.log(message)
})

export const contactFormRouter: Router = Router()

contactFormRouter.get('/health', async (_req, res) => {
    for (const chatId of CHAT_IDS) {
        await telegramBot.sendMessage(chatId, 'Glen was on Telegram.')
    }
    res.send('Messages sent.')
})

contactFormRouter.post('/', async (req, res) => {
    const { name, email, content } = req.body
    for (const chatId of CHAT_IDS) {
        await telegramBot.sendMessage(
            chatId,
            `LOONEY ANFRAGE\n\nName: ${name}\nEmail: ${email}\n\n${content}`,
        )
    }
    res.json({ success: true })
})
