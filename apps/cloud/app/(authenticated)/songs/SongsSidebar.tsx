'use client'

import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H2 from '@repo/ui/typography/H2'
import H4 from '@repo/ui/typography/H4'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDeferredValue, useMemo, useState } from 'react'
import { toggleFavoriteAction } from './actions'
import { FavoriteToggleButton } from './FavoriteToggleButton'

type Song = {
    id: string
    artist: string
    title: string
    genre: string | null
    isFavorite: boolean
}

const filterSongs = (songs: Song[], q: string): Song[] => {
    const needle = q.trim().toLowerCase()
    if (!needle) return songs
    return songs.filter(
        (song) =>
            song.artist.toLowerCase().includes(needle) ||
            song.title.toLowerCase().includes(needle),
    )
}

export function SongsSidebar({ songs }: { songs: Song[] }) {
    const pathname = usePathname()
    const [query, setQuery] = useState('')
    const deferredQuery = useDeferredValue(query)

    const filtered = useMemo(
        () => filterSongs(songs, deferredQuery),
        [songs, deferredQuery],
    )
    const highlight = deferredQuery.trim() || null

    return (
        <section className='max-w-96 flex-grow max-lg:w-full'>
            <Button asChild className='float-start' variant='ghost' size='icon'>
                <Link href='/'>
                    <ArrowLeft className='h-6 w-6 text-white' />
                </Link>
            </Button>

            <H2>Songs</H2>

            <Button asChild className='mt-8'>
                <Link href='/songs/create'>New</Link>
            </Button>

            <div className='relative mt-4'>
                <Input
                    id='song-search'
                    type='search'
                    name='q'
                    aria-label='Song search input'
                    placeholder='Search'
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            <ul className='mt-8 space-y-2'>
                {filtered.map(
                    ({ id, artist, title, genre, isFavorite }, index) => (
                        <li key={id}>
                            {filtered[index - 1]?.genre !== genre && (
                                <H4 className='mb-2 mt-6 text-blue-300'>
                                    {genre ?? 'Unknown'}
                                </H4>
                            )}
                            <div className='flex gap-3'>
                                <form action={toggleFavoriteAction}>
                                    <input type='hidden' name='id' value={id} />
                                    <FavoriteToggleButton
                                        isFavorite={isFavorite}
                                    />
                                </form>

                                <Link
                                    href={`/songs/${id}`}
                                    className={cn('hover:underline', {
                                        underline:
                                            pathname === `/songs/${id}` ||
                                            pathname.startsWith(
                                                `/songs/${id}/`,
                                            ),
                                    })}
                                >
                                    <Body2 className='inline whitespace-nowrap'>
                                        <SearchHighlight
                                            text={artist}
                                            searchString={highlight}
                                        />
                                    </Body2>
                                    &nbsp;&bull;{' '}
                                    <Body1 className='inline whitespace-nowrap'>
                                        <SearchHighlight
                                            text={title}
                                            searchString={highlight}
                                        />
                                    </Body1>
                                </Link>
                            </div>
                        </li>
                    ),
                )}
            </ul>
        </section>
    )
}
