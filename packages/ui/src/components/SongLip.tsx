import { LipDTO } from '@repo/api'
import { toNonBreaking } from '@repo/utils/text'
import SearchHighlight from './SearchHighlight'

export default function SongLip({
    lip,
    q,
}: Readonly<{
    lip: LipDTO
    q?: string
}>) {
    const searchString = q ?? ''

    return (
        <div className='relative h-24 w-full max-w-96 select-none'>
            <div className='absolute left-1 top-1 h-full w-full bg-black' />
            <section className='relative h-full w-full border-2 border-black bg-white p-2 text-black'>
                <p>
                    <SearchHighlight
                        text={toNonBreaking(lip.singerName)}
                        searchString={searchString}
                    />
                </p>
                <p>
                    <SearchHighlight
                        text={toNonBreaking(lip.artist)}
                        searchString={searchString}
                    />
                </p>
                <p>
                    <SearchHighlight
                        text={toNonBreaking(lip.songTitle)}
                        searchString={searchString}
                    />
                </p>
            </section>
        </div>
    )
}
