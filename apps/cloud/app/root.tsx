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
import BoxMain from '@repo/ui/components/BoxMain'
import Spinner from '@repo/ui/components/Spinner'
import { FONT_SANS_URL, FONT_SERIF_URL } from '@repo/ui/constants'
import '@repo/ui/styles.css'
import H1 from '@repo/ui/typography/H1'
import { useEffectEvent } from '@repo/utils/hooks'
import { ReactNode, useEffect, useState } from 'react'
import { handleBeforeUnload } from '~/helpers/handle-before-unload'
import { hasAccess } from '~/helpers/has-access'
import { useUserSession } from '~/hooks/useUserSession'
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
            <body className='bg-blue-800 text-white'>
                <TRPCQueryClientProvider
                    baseUrl={import.meta.env.VITE_API_URL}
                    supabaseClient={supabase}
                >
                    {children}
                </TRPCQueryClientProvider>
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

    const [isInit, setIsInit] = useState(false)

    const handleLifecycle = useEffectEvent(async () => {
        window.addEventListener('beforeunload', handleBeforeUnload)
        setIsInit(true)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    })

    useEffect(() => {
        void handleLifecycle()
    }, [handleLifecycle])

    const { userSession, isUserSessionLoading } = useUserSession(!isInit)

    if (isUserSessionLoading) {
        return (
            <BoxMain className='flex items-center justify-center'>
                <Spinner light />
            </BoxMain>
        )
    }

    if (
        !userSession ||
        (userSession.expires_at &&
            new Date(userSession.expires_at * 1000) < new Date())
    ) {
        navigate('/signin')
        return null
    }

    if (!hasAccess(userSession?.user.accessRole)) {
        return (
            <BoxMain className='flex items-center justify-center'>
                <H1>Unauthorized</H1>
            </BoxMain>
        )
    }

    return <Outlet />
}
