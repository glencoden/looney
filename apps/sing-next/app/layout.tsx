import BoxMain from '@repo/ui/components/BoxMain'
import { FONT_SANS_URL, FONT_SERIF_URL } from '@repo/ui/constants'
import '@repo/ui/styles.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
    title: 'Sing with the Looneytunez',
    description:
        'Browse and select songs to get called on stage and sing with the Looneytunez band.',
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin='anonymous'
                />
                <link rel='stylesheet' href={FONT_SANS_URL} />
                <link rel='stylesheet' href={FONT_SERIF_URL} />
            </head>
            <body className='bg-pink-600 text-white'>
                <Providers>
                    <BoxMain className='flex items-center justify-center p-0'>
                        <div className='mobile-sim-height relative w-full overflow-hidden sm:max-w-md sm:rounded-[32px] sm:border-4 sm:border-black'>
                            {children}
                        </div>
                    </BoxMain>
                </Providers>
            </body>
        </html>
    )
}
