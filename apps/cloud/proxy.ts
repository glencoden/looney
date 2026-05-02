import { getSessionCookie } from 'better-auth/cookies'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/signin', '/signout']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    ) {
        return NextResponse.next()
    }

    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|webmanifest|txt|xml)).*)',
    ],
}
