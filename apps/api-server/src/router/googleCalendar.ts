import assert from 'assert'
import { Router } from 'express'
import { google } from 'googleapis'

const CALENDAR_SCOPES = process.env.CALENDAR_SCOPES
const GLEN_CALENDAR_PROJECT_NUMBER = process.env.GLEN_CALENDAR_PROJECT_NUMBER
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
const GOOGLE_PRIVATE_KEY_BASE64 = process.env.GOOGLE_PRIVATE_KEY_BASE64
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL

assert(CALENDAR_SCOPES, 'Expect CALENDAR_SCOPES to be set.')
assert(
    GLEN_CALENDAR_PROJECT_NUMBER,
    'Expect GLEN_CALENDAR_PROJECT_NUMBER to be set.',
)
assert(GOOGLE_CALENDAR_ID, 'Expect GOOGLE_CALENDAR_ID to be set.')
assert(GOOGLE_PRIVATE_KEY_BASE64, 'Expect GOOGLE_PRIVATE_KEY_BASE64 to be set.')
assert(GOOGLE_CLIENT_EMAIL, 'Expect GOOGLE_CLIENT_EMAIL to be set.')

/**
 *
 * Init Google Calendar client
 *
 */

const GOOGLE_PRIVATE_KEY = atob(process.env.GOOGLE_PRIVATE_KEY_BASE64 ?? '')

const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    undefined,
    GOOGLE_PRIVATE_KEY,
    CALENDAR_SCOPES,
)

// @ts-ignore
const calendar = google.calendar({
    version: 'v3',
    project: GLEN_CALENDAR_PROJECT_NUMBER,
    auth: jwtClient,
})

/**
 *
 * Helpers
 *
 */

type EventResult = {
    venue: string
    description: string
    start: string
}

const EVENT_IDENTIFIER = '@'

const HIDDEN_WORDS = ['confirmed', 'anfrage', 'angefragt']

const HIDDEN_WORDS_REGEX = HIDDEN_WORDS.map((word: string) => {
    let matchString = ''
    for (let i = 0; i < word.length; i++) {
        matchString += `[${word[i]!.toLowerCase()}${word[i]!.toUpperCase()}]`
    }
    matchString += '[^a-zA-Z]?'
    return new RegExp(matchString, 'g')
})

const removeHiddenWords = (input: string): string => {
    let result = input
    for (let i = 0; i < HIDDEN_WORDS_REGEX.length; i++) {
        const currentWord = HIDDEN_WORDS_REGEX[i]
        result = result.replace(currentWord!, '')
    }
    return result.trim()
}

/**
 *
 * Router
 *
 */

export const googleCalendarRouter: Router = Router()

googleCalendarRouter.get('/events', async (_req, res) => {
    calendar.events.list(
        {
            calendarId: GOOGLE_CALENDAR_ID,
            timeMin: new Date(
                Date.now() - 1000 * 60 * 60 * 24 * 180,
            ).toISOString(),
            maxResults: 99,
            singleEvents: true,
            orderBy: 'startTime',
        },
        (error, result) => {
            if (error) {
                res.json({
                    data: null,
                    error,
                })
                return
            }
            const parsedEvents: EventResult[] = []

            result?.data.items?.forEach((item) => {
                const start = item.start?.dateTime || item.start?.date

                if (
                    typeof item.summary !== 'string' ||
                    typeof start !== 'string'
                ) {
                    console.warn('unexpected google calendar event item', item)
                    return
                }

                if (!item.summary.includes(EVENT_IDENTIFIER)) {
                    return
                }

                const [description, venue] =
                    item.summary.split(EVENT_IDENTIFIER)

                if (
                    typeof description !== 'string' ||
                    typeof venue !== 'string'
                ) {
                    throw new Error(
                        'Expect description and venue to be in google calendar event item',
                    )
                }

                parsedEvents.push({
                    venue: removeHiddenWords(venue),
                    description: removeHiddenWords(description),
                    start,
                })
            })

            res.json({
                data: parsedEvents,
                error: null,
            })
        },
    )
})
