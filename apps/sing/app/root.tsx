import type { LinksFunction } from '@remix-run/node'
import {
    Links,
    Meta,
    MetaFunction,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react'

import { TRPCQueryClientProvider } from '@repo/api/provider'
import BoxMain from '@repo/ui/components/BoxMain'
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
        { title: 'Sing with the Looneytunez' },
        {
            name: 'description',
            content:
                'Browse and select songs to get called on stage and sing with the Looneytunez band.',
        },
    ]
}

export default function App() {
    return (
        <TRPCQueryClientProvider baseUrl={import.meta.env.VITE_API_URL}>
            <BoxMain className='flex items-center justify-center p-0'>
                <div className='h-dvh w-full overflow-y-auto px-6 py-12 sm:h-[932px] sm:max-w-md sm:rounded-[32px] sm:border-4 sm:border-black'>
                    <Outlet />
                </div>
            </BoxMain>
        </TRPCQueryClientProvider>
    )
}
