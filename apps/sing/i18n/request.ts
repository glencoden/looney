import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const SUPPORTED_LOCALES = ['en', 'de'] as const
const DEFAULT_LOCALE = 'en'

const detectLocale = async () => {
    const cookieStore = await cookies()
    const fromCookie = cookieStore.get('NEXT_LOCALE')?.value
    if (fromCookie && SUPPORTED_LOCALES.includes(fromCookie as 'en' | 'de')) {
        return fromCookie
    }

    const acceptLanguage = (await headers()).get('accept-language') ?? ''
    const negotiator = new Negotiator({
        headers: { 'accept-language': acceptLanguage },
    })
    const requested = negotiator.languages()
    try {
        return match(requested, SUPPORTED_LOCALES, DEFAULT_LOCALE)
    } catch {
        return DEFAULT_LOCALE
    }
}

export default getRequestConfig(async () => {
    const locale = await detectLocale()
    const messages = (
        await (locale === 'de'
            ? import('../messages/de.json')
            : import('../messages/en.json'))
    ).default

    return { locale, messages }
})
