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
import { useEffect } from 'react'
import './styles/fonts.css'
import './styles/tailwind.css'

export const links: LinksFunction = () => [
    {
        rel: 'preload',
        href: '/fonts/AvantGardGothEF-Med.otf',
        as: 'font',
        type: 'font/otf',
        crossOrigin: 'anonymous',
    },
]

export function Layout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.returnValue = false
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])

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
            <body className='text-shadow bg-blue-800 text-[70px] font-medium shadow-stone-950'>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Looney Tool' },
        { name: 'description', content: 'Karaoke text highlighter.' },
    ]
}

export default function App() {
    return (
        <TRPCQueryClientProvider>
            <Outlet />
        </TRPCQueryClientProvider>
    )
}
