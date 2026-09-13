import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse, type NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'de'] as const
const DEFAULT_LOCALE = 'en'

export function proxy(request: NextRequest) {
    const response = NextResponse.next()

    if (request.cookies.get('NEXT_LOCALE')) {
        return response
    }

    const acceptLanguage = request.headers.get('accept-language') ?? ''
    const negotiator = new Negotiator({
        headers: { 'accept-language': acceptLanguage },
    })
    const requested = negotiator.languages()

    let locale: string = DEFAULT_LOCALE
    try {
        locale = match(requested, SUPPORTED_LOCALES, DEFAULT_LOCALE)
    } catch {
        locale = DEFAULT_LOCALE
    }

    response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        sameSite: 'lax',
    })
    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|webmanifest|txt|xml)).*)',
    ],
}
