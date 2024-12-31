import type { LinksFunction } from '@remix-run/node'
import {
    Links,
    Meta,
    MetaFunction,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react'

import { FONT_SANS_URL, FONT_SERIF_URL } from '@repo/ui/constants'
import '@repo/ui/styles.css'
import { ReactNode } from 'react'
import './tailwind.css'

export const links: LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: FONT_SANS_URL,
    },
    {
        rel: 'stylesheet',
        href: FONT_SERIF_URL,
    },
    {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/site.webmanifest' },
]

export function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <Meta />
                <Links />
            </head>
            <body className='bg-pink-600 text-white'>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Songs - Looneytunez' },
        {
            name: 'description',
            content: 'Looneytunez Karaoke song lists.',
        },
    ]
}

export default function App() {
    return <Outlet />
}
