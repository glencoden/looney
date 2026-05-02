'use client'

import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import Spinner from '@repo/ui/components/Spinner'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { toNonBreaking } from '@repo/utils/text'
import { AudioLines, Circle } from 'lucide-react'
import Link from 'next/link'
import { useDebouncedSearchNav } from '~/hooks/useDebouncedSearchNav'
import { toggleSongInSetlistAction } from '../../actions'

type Setlist = { id: string; title: string }
type Song = { id: string; artist: string; title: string }

export function SetlistEditClient({
    setlist,
    songs,
    selectedSongs,
    initialQ,
}: {
    setlist: Setlist
    songs: Song[]
    selectedSongs: { id: string }[]
    initialQ: string
}) {
    const search = useDebouncedSearchNav({
        initialValue: initialQ || null,
        buildUrl: (value) =>
            value
                ? `/setlists/${setlist.id}/edit?q=${encodeURIComponent(value)}`
                : `/setlists/${setlist.id}/edit`,
    })

    return (
        <div
            className={cn('flex-grow max-lg:w-full', {
                'animate-pulse': search.isPending,
            })}
        >
            <Subtitle2 className='float-end flex items-center gap-1'>
                {selectedSongs.length}
                <AudioLines className='h-4 w-4' />
            </Subtitle2>

            <H3 className='min-h-9 px-10'>
                Edit&nbsp;{toNonBreaking(setlist.title)}
            </H3>

            <section className='mt-8 flex gap-3'>
                <Button asChild disabled={search.isPending}>
                    <Link href={`/setlists/${setlist.id}`}>Done</Link>
                </Button>

                <div className='relative w-full flex-grow'>
                    <Input
                        id='song-search'
                        type='search'
                        name='q'
                        aria-label='Song search input'
                        placeholder='Search'
                        defaultValue={initialQ}
                        onChange={search.onChange}
                    />
                    {search.isPending && (
                        <Spinner className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' />
                    )}
                </div>
            </section>

            <ul className='mt-8 space-y-2'>
                {songs.map(({ id, artist, title }) => {
                    const isSelected = selectedSongs.some((s) => s.id === id)
                    return (
                        <li key={id}>
                            <div className='flex gap-3'>
                                <form action={toggleSongInSetlistAction}>
                                    <input
                                        type='hidden'
                                        name='setlistId'
                                        value={setlist.id}
                                    />
                                    <input
                                        type='hidden'
                                        name='songId'
                                        value={id}
                                    />
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='mt-[1px]'
                                        aria-label={
                                            isSelected
                                                ? 'Remove from setlist'
                                                : 'Add to setlist'
                                        }
                                        name='selected'
                                        value={isSelected ? 'false' : 'true'}
                                        type='submit'
                                    >
                                        <div className='relative h-4 w-4'>
                                            <Circle
                                                className={cn(
                                                    'h-4 w-4 text-blue-700',
                                                    {
                                                        'fill-white text-white':
                                                            isSelected,
                                                    },
                                                )}
                                            />
                                        </div>
                                    </Button>
                                </form>

                                <div
                                    className={cn({
                                        'text-blue-300': !isSelected,
                                    })}
                                >
                                    <Body2
                                        className={cn('inline', {
                                            'text-blue-300': !isSelected,
                                        })}
                                    >
                                        <SearchHighlight
                                            text={toNonBreaking(artist)}
                                            searchString={initialQ || null}
                                        />
                                    </Body2>
                                    &nbsp;&bull;{' '}
                                    <Body1
                                        className={cn('inline', {
                                            'text-blue-300': !isSelected,
                                        })}
                                    >
                                        <SearchHighlight
                                            text={toNonBreaking(title)}
                                            searchString={initialQ || null}
                                        />
                                    </Body1>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
