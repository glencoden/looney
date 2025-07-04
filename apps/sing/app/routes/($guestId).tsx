import {
    Link,
    Outlet,
    useLoaderData,
    useLocation,
    useNavigate,
} from '@remix-run/react'
import { api } from '@repo/api/client'
import { Guest, Session } from '@repo/db'
import {
    getGuest,
    getSession,
    getSongs,
    getSongsBySetlistId,
} from '@repo/db/queries'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H2 from '@repo/ui/typography/H2'
import H4 from '@repo/ui/typography/H4'
import { useSessionCountdown } from '@repo/utils/hooks'
import { toNonBreaking } from '@repo/utils/text'
import { json, LoaderFunctionArgs } from '@vercel/remix'
import { Star } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Drawer } from 'vaul'

type LoaderResponse = {
    guest: Guest | null
    session: Session | null
    songs:
        | Awaited<ReturnType<typeof getSongs>>
        | Awaited<ReturnType<typeof getSongsBySetlistId>>
        | null
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const guestId = params.guestId

    // TODO: Make this work to try the tool without session
    if (!guestId) {
        const songs = await getSongs()

        return json<LoaderResponse>({ guest: null, session: null, songs })
    }

    const guest = await getGuest(guestId)

    const session = guest?.sessionId ? await getSession(guest.sessionId) : null
    const songs = session ? await getSongsBySetlistId(session.setlistId) : null

    return json<LoaderResponse>({ guest, session, songs })
}

export default function Index() {
    const {
        guest,
        session: sessionFromLoader,
        songs,
    } = useLoaderData<typeof loader>()

    const { data: session } = api.session.get.useQuery(
        {
            id: sessionFromLoader?.id!,
        },
        {
            initialData: {
                ...sessionFromLoader,
                startsAt: new Date(sessionFromLoader?.startsAt!),
                endsAt: new Date(sessionFromLoader?.endsAt!),
                createdAt: new Date(sessionFromLoader?.createdAt!),
            } as unknown as Session,
            enabled: Boolean(sessionFromLoader?.id),
            refetchInterval: 1000 * 60,
        },
    )

    const intl = useIntl()

    /**
     *
     * Pages drawer
     *
     */

    const pages = useMemo(() => {
        return ['songs', 'feedback']
        // const navigationPages: NavigationPage[] = ['songs', 'feedback', 'tip']
        // if (session?.hideTipCollection) {
        //     return navigationPages.filter((page) => page !== 'tip')
        // }
        // return navigationPages
    }, [session])

    const drawerBoxRef = useRef<HTMLElement>(null)
    const [drawerBoxElement, setDrawerBoxElement] = useState<HTMLElement>()

    useEffect(() => {
        let retryCount = 0
        let timeoutId: ReturnType<typeof setTimeout>
        const assignDrawerBoxElement = () => {
            if (retryCount >= 10) {
                throw new Error('Expect drawer box to be present.')
            }
            if (!drawerBoxRef.current) {
                timeoutId = setTimeout(assignDrawerBoxElement, 50)
                retryCount++
                return
            }
            clearTimeout(timeoutId)
            setDrawerBoxElement(drawerBoxRef.current)
        }
        assignDrawerBoxElement()
        return () => {
            clearTimeout(timeoutId)
        }
    }, [])

    /**
     *
     * Navigation
     *
     */

    const root = guest ? `/${guest.id}` : '/'
    const base = guest ? `/${guest.id}` : ''

    const navigate = useNavigate()
    const location = useLocation()

    /**
     *
     * Song list filter
     *
     */

    const [q, setQ] = useState('')

    const filteredSongs = useMemo(() => {
        if (!songs) {
            return []
        }
        return songs.filter((song) => {
            return (
                song.artist.toLowerCase().includes(q.toLowerCase()) ||
                song.title.toLowerCase().includes(q.toLowerCase())
            )
        })
    }, [songs, q])

    const countdown = useSessionCountdown(session?.startsAt)

    if (countdown) {
        return (
            <div className='mobile-sim-height flex flex-col items-center justify-center'>
                <H2 className='px-6'>
                    {intl.formatMessage({
                        id: 'root.countdown.headline',
                        defaultMessage: 'The Karaoke sign-up starts in:',
                    })}
                </H2>
                <H2>{countdown}</H2>
            </div>
        )
    }

    if (!session || session.endsAt < new Date()) {
        return (
            <div className='mobile-sim-height flex items-center justify-center'>
                <H2>
                    {intl.formatMessage({
                        id: 'root.waiting.headline',
                        defaultMessage:
                            'Please scan the QR code again when there is an active session.',
                    })}
                </H2>
            </div>
        )
    }

    return (
        <>
            <section className='mobile-sim-height overflow-y-auto px-6 py-12'>
                <Input
                    id='song-search'
                    className='focus-visible:ring-blue-300'
                    type='search'
                    name='q'
                    aria-label='Song search input'
                    placeholder={intl.formatMessage({
                        id: 'search.placeholder',
                        defaultMessage: 'Search',
                    })}
                    defaultValue={q || ''}
                    onChange={(event) => {
                        setQ(event.target.value)
                    }}
                />

                <H2 className='mt-6'>
                    {intl.formatMessage({
                        id: 'home.heading',
                        defaultMessage: 'Click on a Song!',
                    })}
                </H2>

                <ul className='mt-8 space-y-2 pb-48'>
                    {filteredSongs.map(
                        ({ id, artist, title, genre, isFavorite }, index) => (
                            <li key={id}>
                                {filteredSongs[index - 1]?.genre !== genre && (
                                    <H4 className='mb-2 mt-6 text-blue-800'>
                                        {genre ?? 'Unknown'}
                                    </H4>
                                )}
                                <Link
                                    to={`/create/${guest!.id}/${id}`}
                                    className='flex items-center gap-3'
                                >
                                    <Star
                                        className={cn('h-4 w-4 text-pink-500', {
                                            'fill-white text-white': isFavorite,
                                        })}
                                    />
                                    <div>
                                        <Body2 className='inline'>
                                            <SearchHighlight
                                                text={toNonBreaking(artist)}
                                                searchString={q}
                                            />
                                        </Body2>
                                        &nbsp;&bull;&#32;
                                        <Body1 className='inline'>
                                            <SearchHighlight
                                                text={toNonBreaking(title)}
                                                searchString={q}
                                            />
                                        </Body1>
                                    </div>
                                </Link>
                            </li>
                        ),
                    )}
                </ul>
            </section>

            <section
                ref={drawerBoxRef}
                className='absolute inset-x-0 bottom-0 h-24'
            >
                {drawerBoxElement && (
                    <Drawer.Root
                        open={location.pathname !== root}
                        container={drawerBoxElement}
                    >
                        <div className='absolute inset-x-0 bottom-0 h-1 bg-black' />
                        <div className='absolute inset-x-0 bottom-1 h-24 rounded-t-2xl bg-black' />

                        <nav
                            className={cn(
                                'pointer-events-auto absolute bottom-0 left-1 right-1 z-20 grid h-24 place-items-center rounded-t-[13px] bg-blue-800',
                                {
                                    'grid-cols-2': pages.length === 2,
                                    'grid-cols-3': pages.length === 3,
                                },
                            )}
                        >
                            {pages.includes('songs') && (
                                <Button
                                    asChild
                                    size='sm'
                                    className={cn('px-1', {
                                        'text-white':
                                            location.pathname ===
                                            `${base}/songs`,
                                    })}
                                >
                                    <Link
                                        to={
                                            location.pathname ===
                                            `${base}/songs`
                                                ? root
                                                : `${base}/songs`
                                        }
                                    >
                                        {intl.formatMessage({
                                            id: 'nav.button.songs',
                                            defaultMessage: 'Songs',
                                        })}
                                    </Link>
                                </Button>
                            )}
                            {pages.includes('feedback') && (
                                <Button
                                    asChild
                                    size='sm'
                                    className={cn('px-1', {
                                        'text-white':
                                            location.pathname ===
                                            `${base}/feedback`,
                                    })}
                                >
                                    <Link
                                        to={
                                            location.pathname ===
                                            `${base}/feedback`
                                                ? root
                                                : `${base}/feedback`
                                        }
                                    >
                                        {intl.formatMessage({
                                            id: 'nav.button.feedback',
                                            defaultMessage: 'Feedback',
                                        })}
                                    </Link>
                                </Button>
                            )}
                            {pages.includes('tip') && (
                                <Button
                                    asChild
                                    size='sm'
                                    className={cn('px-1', {
                                        'text-white':
                                            location.pathname === `${base}/tip`,
                                    })}
                                >
                                    <Link
                                        to={
                                            location.pathname === `${base}/tip`
                                                ? root
                                                : `${base}/tip`
                                        }
                                    >
                                        {intl.formatMessage({
                                            id: 'nav.button.tip',
                                            defaultMessage: 'Tip the band',
                                        })}
                                    </Link>
                                </Button>
                            )}
                        </nav>

                        <Drawer.Overlay
                            className='absolute inset-x-0 bottom-24 h-dvh'
                            onClick={() => navigate(root)}
                        />

                        <Drawer.Content className='absolute inset-x-0 bottom-20 z-10 mt-24 box-content flex h-auto flex-col items-center gap-8 rounded-t-2xl border-l-4 border-r-4 border-t-4 border-black bg-blue-800 px-6 py-12 pb-4 shadow-[0_-6px_14px_rgba(0,0,0,0.25)] outline-0'>
                            <div className='min-h-80 w-full'>
                                <Outlet />
                            </div>
                        </Drawer.Content>
                    </Drawer.Root>
                )}
            </section>
        </>
    )
}
