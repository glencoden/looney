import { api } from '@repo/api/client'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import Spinner from '@repo/ui/components/Spinner'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H4 from '@repo/ui/typography/H4'
import { toNonBreaking } from '@repo/utils/text'
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
        <div className='mt-2 flex min-w-0 shrink flex-col items-center'>
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
            />

            <ul className='mt-4 h-[45vh] min-w-full space-y-2 overflow-y-auto pb-48'>
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
                                <div
                                    className='cursor-pointer'
                                    onClick={() => handleSongClick(id)}
                                >
                                    <Body2 dark className='inline'>
                                        <SearchHighlight
                                            text={toNonBreaking(artist)}
                                            searchString={q}
                                        />
                                    </Body2>
                                    &nbsp;&bull;&#32;
                                    <Body1 dark className='inline'>
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
