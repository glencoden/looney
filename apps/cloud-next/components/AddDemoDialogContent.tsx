'use client'

import { api } from '@repo/api/client'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import Spinner from '@repo/ui/components/Spinner'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H4 from '@repo/ui/typography/H4'
import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function AddDemoDialogContent({
    handleSongClick,
}: {
    handleSongClick: (songId: string) => void
}) {
    const { data: songs } = api.song.getAll.useQuery()

    const [q, setQ] = useState('')

    const filteredSongs = useMemo(() => {
        if (!songs) return []
        return songs.filter((song) => {
            return (
                song.artist.toLowerCase().includes(q.toLowerCase()) ||
                song.title.toLowerCase().includes(q.toLowerCase())
            )
        })
    }, [songs, q])

    return (
        <div className='mt-2 min-w-0 px-2'>
            <Input
                id='song-search'
                type='search'
                name='q'
                aria-label='Song search input'
                placeholder='Search'
                defaultValue={q || ''}
                onChange={(event) => {
                    setQ(event.target.value)
                }}
                className='mx-auto block'
            />

            <ul className='mt-4 h-[45vh] space-y-2 overflow-y-auto pb-48'>
                {!songs && (
                    <div className='flex h-full items-center justify-center'>
                        <Spinner />
                    </div>
                )}
                {songs && filteredSongs.length === 0 && (
                    <div className='flex h-full items-center justify-center'>
                        <Body2 dark className='text-center'>
                            No songs found
                        </Body2>
                    </div>
                )}
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
                                    className={cn('h-4 w-4 text-blue-300', {
                                        'fill-blue-300': isFavorite,
                                    })}
                                />
                                <button
                                    type='button'
                                    className='cursor-pointer text-left'
                                    onClick={() => handleSongClick(id)}
                                >
                                    <Body2
                                        dark
                                        className='inline whitespace-nowrap'
                                    >
                                        <SearchHighlight
                                            text={artist}
                                            searchString={q}
                                        />
                                    </Body2>
                                    &nbsp;&bull;{' '}
                                    <Body1
                                        dark
                                        className='inline whitespace-nowrap'
                                    >
                                        <SearchHighlight
                                            text={title}
                                            searchString={q}
                                        />
                                    </Body1>
                                </button>
                            </div>
                        </li>
                    ),
                )}
            </ul>
        </div>
    )
}
