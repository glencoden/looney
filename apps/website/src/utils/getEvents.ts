import { google } from 'googleapis'

export interface LiveEvent {
    venue: string
    description: string
    start: string
}

const EVENT_IDENTIFIER = '@'
const HIDDEN_WORDS = ['confirmed', 'anfrage', 'angefragt']

const HIDDEN_WORDS_REGEX = HIDDEN_WORDS.map((word: string) => {
    let matchString = ''
    for (let i = 0; i < word.length; i++) {
        matchString += `[${word[i].toLowerCase()}${word[i].toUpperCase()}]`
    }
    matchString += '[^a-zA-Z]?'
    return new RegExp(matchString, 'g')
})

const removeHiddenWords = (input: string): string => {
    let result = input
    for (let i = 0; i < HIDDEN_WORDS_REGEX.length; i++) {
        const currentWord = HIDDEN_WORDS_REGEX[i]
        result = result.replace(currentWord, '')
    }
    return result.trim()
}

export async function getEvents(): Promise<LiveEvent[]> {
    const {
        GLEN_CALENDAR_PROJECT_NUMBER,
        GOOGLE_CALENDAR_ID,
        CALENDAR_SCOPES,
        GOOGLE_PRIVATE_KEY_BASE64,
        GOOGLE_CLIENT_EMAIL,
    } = process.env

    if (!GOOGLE_PRIVATE_KEY_BASE64 || !GOOGLE_CLIENT_EMAIL || !GOOGLE_CALENDAR_ID) {
        console.warn('Missing Google Calendar credentials')
        return []
    }

    const GOOGLE_PRIVATE_KEY = atob(GOOGLE_PRIVATE_KEY_BASE64)

    const jwtClient = new google.auth.JWT(
        GOOGLE_CLIENT_EMAIL,
        undefined,
        GOOGLE_PRIVATE_KEY,
        CALENDAR_SCOPES,
    )

    const calendar = google.calendar({
        version: 'v3',
        project: GLEN_CALENDAR_PROJECT_NUMBER,
        auth: jwtClient,
    })

    try {
        const response = await calendar.events.list({
            calendarId: GOOGLE_CALENDAR_ID,
            timeMin: new Date(
                Date.now() - 1000 * 60 * 60 * 24 * 180,
            ).toISOString(),
            maxResults: 99,
            singleEvents: true,
            orderBy: 'startTime',
        })

        const items = response?.data?.items
        if (!Array.isArray(items)) {
            console.warn('unexpected google calendar events API result')
            return []
        }

        const result: LiveEvent[] = []

        for (const item of items) {
            const start = item?.start?.dateTime || item?.start?.date

            if (typeof item?.summary !== 'string' || typeof start !== 'string') {
                console.warn('unexpected google calendar event item', item)
                continue
            }

            if (!item.summary.includes(EVENT_IDENTIFIER)) {
                continue
            }

            const [description, venue] = item.summary.split(EVENT_IDENTIFIER)

            result.push({
                venue: removeHiddenWords(venue),
                description: removeHiddenWords(description),
                start,
            })
        }

        return result
    } catch (error) {
        console.error('Failed to fetch calendar events:', error)
        return []
    }
}
