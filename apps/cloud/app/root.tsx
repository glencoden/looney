import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigate,
} from '@remix-run/react'

import { TRPCQueryClientProvider } from '@repo/api/provider'
import { FONT_SANS_URL, FONT_SERIF_URL } from '@repo/ui/constants'
import '@repo/ui/styles.css'
import { useEffectEvent } from '@repo/utils/hooks'
import { ReactNode, useEffect } from 'react'
import { SYLLABLE_CHAR } from '~/CONSTANTS'
import { handleBeforeUnload } from '~/helpers/handle-before-unload'
import { supabase } from '~/lib/supabase.client'
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
    { rel: 'modulepreload', href: '/vendor/hyphenator.js' },
    { rel: 'modulepreload', href: '/vendor/hyphenator-patterns/de.js' },
    { rel: 'modulepreload', href: '/vendor/hyphenator-patterns/en-gb.js' },
    { rel: 'modulepreload', href: '/vendor/hyphenator-patterns/en-us.js' },
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
                <script
                    type='text/javascript'
                    src='/vendor/hyphenator.js'
                ></script>
                <script
                    type='text/javascript'
                    src='/vendor/hyphenator-patterns/de.js'
                ></script>
                <script
                    type='text/javascript'
                    src='/vendor/hyphenator-patterns/en-gb.js'
                ></script>
                <script
                    type='text/javascript'
                    src='/vendor/hyphenator-patterns/en-us.js'
                ></script>
            </head>
            <body className='bg-blue-800 text-white'>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export const meta: MetaFunction = () => {
    return [
        { title: 'Looney Cloud' },
        { name: 'description', content: 'Console for Looneytunez cloud.' },
    ]
}

export default function App() {
    const navigate = useNavigate()

    const handleLifecycle = useEffectEvent(async () => {
        const { data } = await supabase.auth.getSession()

        if (
            data.session === null ||
            data.session.expires_at === undefined ||
            new Date(data.session.expires_at * 1000) < new Date()
        ) {
            navigate('/signin')
            return
        }

        // @ts-expect-error Hyphenator is not typed
        Hyphenator.config({
            hyphenchar: SYLLABLE_CHAR,
            minwordlength: 0,
            enablecache: false,
        })

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    })

    useEffect(() => {
        void handleLifecycle()
    }, [handleLifecycle])

    return (
        <TRPCQueryClientProvider supabaseClient={supabase}>
            <Outlet />
        </TRPCQueryClientProvider>
    )
}
