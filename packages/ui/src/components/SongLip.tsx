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
            <div className='relative flex h-full w-full justify-between gap-4 border-2 border-black bg-white px-3 py-2'>
                <section className='h-full'>
                    <Subtitle2 className='whitespace-nowrap text-black'>
                        <SearchHighlight
                            text={toNonBreaking(lip.singerName)}
                            searchString={searchString}
                        />
                    </Subtitle2>
                    <Small className='mt-2.5 whitespace-nowrap text-black'>
                        <SearchHighlight
                            text={toNonBreaking(lip.artist)}
                            searchString={searchString}
                        />
                    </Small>
                    <Subtitle1 className='mt-1 whitespace-nowrap text-black'>
                        <SearchHighlight
                            text={toNonBreaking(lip.songTitle)}
                            searchString={searchString}
                        />
                    </Subtitle1>
                </section>
                <section className='flex h-full flex-col items-end justify-between py-1.5'>
                    {!hideTime && (
                        <Small className='text-black'>
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
