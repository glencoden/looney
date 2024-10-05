import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react'
import type { LinksFunction } from '@remix-run/node'

import './tailwind.css'
import '@repo/ui/styles.css'
import { TRPCQueryClientProvider } from '@repo/api/provider'
import { FONT_SANS_URL } from '@repo/ui/constants'

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
]

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <TRPCQueryClientProvider>
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
                <body>
                    {children}
                    <ScrollRestoration />
                    <Scripts />
                </body>
            </html>
        </TRPCQueryClientProvider>
    )
}

export default function App() {
    return <Outlet />
}
