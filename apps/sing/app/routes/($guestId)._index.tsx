import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getSongs } from '@repo/db/queries'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H4 from '@repo/ui/typography/H4'
import { toNonBreaking } from '@repo/utils/text'
import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const guestId = params.guestId

    // If guestId is undefined:
    //
    // We are in demo mode!
    //
    // 1. As soon as there is an upcoming or ongoing non-demo session > show "scan the QR code to join <session title>"
    // 2. Load all songs and go to business with local state
    // 3. If there is an active demo session, hook up the server state

    if (!guestId) {
        const songs = await getSongs()

        return json({ guest: null, session: null, songs })
    }

    const guest = null // await getGuest(guestId)

    // Throw an error if there is no db record for that guestId

    const session = null // guest.sessionId ? await getSession(guest.sessionId) : null
    const songs = null // session ? await getSongBySetlistId(session.setlistId) : null

    return json({ guest, session, songs })
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
        <div className='h-full'>
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

            <ul className='mt-8 h-full space-y-2 px-1'>
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
        </div>
    )
}
