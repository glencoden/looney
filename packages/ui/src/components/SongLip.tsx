import { LipDTO } from '@repo/api'
import { toNonBreaking } from '@repo/utils/text'
import { formatDistanceToNow } from 'date-fns'
import { Star } from 'lucide-react'
import Small from '../typography/Small'
import Subtitle1 from '../typography/Subtitle1'
import Subtitle2 from '../typography/Subtitle2'
import SearchHighlight from './SearchHighlight'

export default function SongLip({
    lip,
    q,
    hideTime = false,
    hideFavorites = false,
}: Readonly<{
    lip: LipDTO
    q?: string
    hideTime?: boolean
    hideFavorites?: boolean
}>) {
    const searchString = q ?? ''

    return (
        <div className='relative h-24 w-full max-w-96 select-none'>
            <div className='absolute left-1 top-1 h-full w-full bg-black' />
            <div className='relative h-full w-full border-2 border-black bg-white px-3 py-2'>
                <Subtitle2 className='max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap text-black'>
                    <SearchHighlight
                        text={toNonBreaking(lip.singerName)}
                        searchString={searchString}
                    />
                </Subtitle2>
                <Small className='mt-2 max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap text-black'>
                    <SearchHighlight
                        text={toNonBreaking(lip.artist)}
                        searchString={searchString}
                    />
                </Small>
                <Subtitle1 className='max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap text-black'>
                    <SearchHighlight
                        text={toNonBreaking(lip.songTitle)}
                        searchString={searchString}
                    />
                </Subtitle1>

                <section className='absolute right-3 top-0 flex h-full w-[25%] flex-col items-end justify-between py-3'>
                    {!hideTime && (
                        <Small className='text-pink-700'>
                            {formatDistanceToNow(lip.createdAt!)}
                        </Small>
                    )}
                    {!hideFavorites && lip.isFavoriteSong && (
                        <Star className='h-8 w-8 fill-yellow-400 text-yellow-400' />
                    )}
                </section>
            </div>
        </div>
    )
}
