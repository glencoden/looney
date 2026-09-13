import { isPermissionRole } from '@repo/db/permission'
import { getCookieCache, getSessionCookie } from 'better-auth/cookies'
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '~/lib/auth'

const PUBLIC_PATHS = ['/signin', '/signout', '/unauthorized']

const respond = (request: NextRequest, role: unknown) => {
    if (!isPermissionRole(role) || role === 'user') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    return NextResponse.next()
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    ) {
        return NextResponse.next()
    }

    if (getSessionCookie(request)) {
        const cached = await getCookieCache(request, {
            isSecure: process.env.BETTER_AUTH_URL?.startsWith('https://'),
        })
        if (cached) {
            return respond(request, cached.user.permissionRole)
        }
    }

    const { headers, response: session } = await auth.api.getSession({
        headers: request.headers,
        returnHeaders: true,
    })

    const response = session
        ? respond(request, session.user.permissionRole)
        : NextResponse.redirect(new URL('/signin', request.url))

    for (const cookie of headers.getSetCookie()) {
        response.headers.append('set-cookie', cookie)
    }
    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|webmanifest|txt|xml)).*)',
    ],
}
