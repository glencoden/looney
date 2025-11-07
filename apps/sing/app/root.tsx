import {
    Links,
    Meta,
    MetaFunction,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from '@remix-run/react'
import { TRPCQueryClientProvider } from '@repo/api/client'
import BoxMain from '@repo/ui/components/BoxMain'
import { FONT_SANS_URL, FONT_SERIF_URL } from '@repo/ui/constants'
import '@repo/ui/styles.css'
import {
    json,
    type LinksFunction,
    type LoaderFunctionArgs,
} from '@vercel/remix'
import parser from 'accept-language-parser'
import { ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
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
        { title: 'Sing with the Looneytunez' },
        {
            name: 'description',
            content:
                'Browse and select songs to get called on stage and sing with the Looneytunez band.',
        },
    ]
}

const getTranslations = async (locale: string) => {
    switch (locale) {
        case 'en': {
            const translations = await import(
                '~/translations/compiled-messages/en.json'
            )
            return translations.default
        }
        case 'de': {
            const translations = await import(
                '~/translations/compiled-messages/de.json'
            )
            return translations.default
        }
        default:
            throw new Error('Unsupported locale')
    }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const acceptLang = request.headers.get('accept-language')
    const languages = parser.parse(acceptLang ?? undefined)
    const parsed = languages[0]?.code ?? 'unknown'
    const locale = ['en', 'de'].includes(parsed) ? parsed : 'en'

    const translations = await getTranslations(locale)

    return json({ locale, translations })
}

export default function App() {
    const { locale, translations } = useLoaderData<typeof loader>()

    return (
        <TRPCQueryClientProvider>
            <IntlProvider locale={locale} messages={translations}>
                <BoxMain className='flex items-center justify-center p-0'>
                    <div className='mobile-sim-height relative w-full overflow-hidden sm:max-w-md sm:rounded-[32px] sm:border-4 sm:border-black'>
                        <Outlet />
                    </div>
                </BoxMain>
            </IntlProvider>
        </TRPCQueryClientProvider>
    )
}
