'use client'

import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import Spinner from '@repo/ui/components/Spinner'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H2 from '@repo/ui/typography/H2'
import H4 from '@repo/ui/typography/H4'
import { toNonBreaking } from '@repo/utils/text'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDebouncedSearchNav } from '~/hooks/useDebouncedSearchNav'
import { toggleFavoriteAction } from './actions'
import { FavoriteToggleButton } from './FavoriteToggleButton'

type Song = {
    id: string
    artist: string
    title: string
    genre: string | null
    isFavorite: boolean
}

export function SongsSidebar({
    songs,
    q,
}: {
    songs: Song[]
    q: string | null
}) {
    const pathname = usePathname()

    const search = useDebouncedSearchNav({
        initialValue: q,
        buildUrl: (value) =>
            value ? `/songs?q=${encodeURIComponent(value)}` : '/songs',
    })

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
                    defaultValue={q ?? ''}
                    onChange={search.onChange}
                />
                {search.isPending && (
                    <Spinner className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' />
                )}
            </div>

            <ul className='mt-8 space-y-2'>
                {songs.map(
                    ({ id, artist, title, genre, isFavorite }, index) => (
                        <li key={id}>
                            {songs[index - 1]?.genre !== genre && (
                                <H4 className='mb-2 mt-6 text-blue-300'>
                                    {genre ?? 'Unknown'}
                                </H4>
                            )}
                            <div className='flex gap-3'>
                                <form action={toggleFavoriteAction}>
                                    <input
                                        type='hidden'
                                        name='id'
                                        value={id}
                                    />
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
                                </Link>
                            </div>
                        </li>
                    ),
                )}
            </ul>
        </section>
    )
}
