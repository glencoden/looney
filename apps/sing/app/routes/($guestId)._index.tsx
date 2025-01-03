import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Guest, Session } from '@repo/db'
import { getSongs, getSongsBySetlistId } from '@repo/db/queries'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H4 from '@repo/ui/typography/H4'
import { toNonBreaking } from '@repo/utils/text'
import { Star } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Drawer } from 'vaul'

type NavigationPage = 'songs' | 'feedback' | 'tip'

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

    // If guestId is undefined:
    //
    // We are in demo mode!
    //
    // 1. Load all songs and go to business with local state
    // 2. If there is an active demo session, create a fake guest id hook up to server state
    // 3. As soon as there is an upcoming or ongoing non-demo session > show "scan the QR code to join <session title>"

    if (!guestId) {
        const songs = await getSongs()

        return json<LoaderResponse>({ guest: null, session: null, songs })
    }

    const guest = null // await getGuest(guestId)

    // Throw an error if there is no db record for that guestId

    const session = null // guest.sessionId ? await getSession(guest.sessionId) : null
    const songs = null // session ? await getSongBySetlistId(session.setlistId) : null

    return json<LoaderResponse>({ guest, session, songs })
}

export default function Index() {
    const { guest, session, songs } = useLoaderData<typeof loader>()

    console.log('guest', guest)
    console.log('session', session)
    console.log('songs', songs)

    // 1. There is no session in the record yet > show "session coming soon"
    // 2. The session in the record is in the future > show "session start in <time>"
    // 3. The session is ongoing or in the past AND there is no other upcoming or ongoing session > load session and songs for its setlist
    // 4. The session is in the past and there is an upcoming or ongoing non-demo session > show "scan the QR code to join <session title>"

    /**
     *
     * Pages drawer
     *
     */

    const pages = useMemo(() => {
        const navigationPages: NavigationPage[] = ['songs', 'feedback', 'tip']
        if (session?.hideTipCollection) {
            return navigationPages.filter((page) => page !== 'tip')
        }
        return navigationPages
    }, [session])

    const drawerBoxRef = useRef<HTMLElement>(null)
    const [drawerBoxElement, setDrawerBoxElement] = useState<HTMLElement>()

    useEffect(() => {
        if (!drawerBoxRef.current) {
            throw new Error('Expect drawer box to be present.')
        }
        setDrawerBoxElement(drawerBoxRef.current)
    }, [])

    /**
     *
     * Navigation
     *
     */

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedPage, setSelectedPage] = useState<NavigationPage>('songs')

    const createHandleNavButtonClick = (page: NavigationPage) => {
        return () => {
            setSelectedPage((prevPage) => {
                if (prevPage === page && isDrawerOpen) {
                    setIsDrawerOpen(false)
                } else {
                    setIsDrawerOpen(true)
                }
                return page
            })
        }
    }

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

    return (
        <>
            <section className='mobile-sim-height overflow-y-auto px-6 py-12'>
                <Input
                    className='focus-visible:ring-blue-300'
                    id='song-search'
                    aria-label='Song search input'
                    defaultValue={q || ''}
                    name='q'
                    placeholder='Search'
                    type='search'
                    onChange={(event) => {
                        setQ(event.target.value)
                    }}
                />

                <ul className='mt-8 space-y-2 pb-48'>
                    {filteredSongs.map(
                        ({ id, artist, title, genre, isFavorite }, index) => (
                            <li key={id}>
                                {filteredSongs[index - 1]?.genre !== genre && (
                                    <H4 className='mb-2 mt-6 text-blue-800'>
                                        {genre ?? 'Unknown'}
                                    </H4>
                                )}
                                <div className='flex items-center gap-3'>
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
                                </div>
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
                        open={isDrawerOpen}
                        container={drawerBoxElement}
                    >
                        <div className='absolute inset-x-0 bottom-0 h-1 bg-black' />
                        <div className='absolute inset-x-0 bottom-1 h-24 rounded-t-2xl bg-black' />

                        <nav className='pointer-events-auto absolute bottom-0 left-1 right-1 z-20 grid h-24 grid-cols-3 place-items-center rounded-t-[13px] bg-blue-800'>
                            {pages.includes('songs') && (
                                <Button
                                    size='sm'
                                    className='px-1'
                                    onClick={createHandleNavButtonClick(
                                        'songs',
                                    )}
                                >
                                    Songs
                                </Button>
                            )}
                            {pages.includes('feedback') && (
                                <Button
                                    size='sm'
                                    className='px-1'
                                    onClick={createHandleNavButtonClick(
                                        'feedback',
                                    )}
                                >
                                    Feedback
                                </Button>
                            )}
                            {pages.includes('tip') && (
                                <Button
                                    size='sm'
                                    className='px-1'
                                    onClick={createHandleNavButtonClick('tip')}
                                >
                                    Tip the band
                                </Button>
                            )}
                        </nav>

                        <Drawer.Overlay
                            className='absolute inset-x-0 bottom-24 h-dvh'
                            onClick={() => setIsDrawerOpen(false)}
                        />

                        <Drawer.Content className='px-main py-main absolute inset-x-0 bottom-20 z-10 mt-24 box-content flex h-auto flex-col items-center gap-8 rounded-t-2xl border-l-4 border-r-4 border-t-4 border-black bg-blue-800 pb-4 shadow-[0_-6px_14px_rgba(0,0,0,0.25)] outline-0'>
                            <div className='h-80'>
                                {(() => {
                                    switch (selectedPage) {
                                        case 'songs':
                                            return 'songs'
                                            break
                                        case 'feedback':
                                            return (
                                                <Input
                                                    className='focus-visible:ring-blue-300'
                                                    id='feedback-input'
                                                    aria-label='Feedback input'
                                                    defaultValue={q || ''}
                                                    name='feedback'
                                                    placeholder='Feedback'
                                                    type='text'
                                                />
                                            )
                                            break
                                        case 'tip':
                                            return 'tip'
                                            break
                                    }
                                })()}
                            </div>
                        </Drawer.Content>
                    </Drawer.Root>
                )}
            </section>
        </>
    )
}
