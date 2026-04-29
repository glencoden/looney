import { getSong } from '@repo/db/queries'
import Body1 from '@repo/ui/typography/Body1'
import H3 from '@repo/ui/typography/H3'
import { toNonBreaking } from '@repo/utils/text'
import { notFound } from 'next/navigation'
import { Star } from 'lucide-react'
import { cn } from '@repo/ui/helpers'
import { SongActions, SongBackButton } from './SongActions'

export default async function SongDetailPage({
    params,
}: {
    params: Promise<{ songId: string }>
}) {
    const { songId } = await params
    const song = await getSong(songId)
    if (!song) notFound()

    return (
        <div className='flex-grow max-lg:w-full'>
            <SongBackButton />

            <Star
                className={cn('float-end h-8 w-8 text-blue-700', {
                    'fill-white text-white': song.isFavorite,
                })}
            />

            <H3 className='min-h-9 px-10'>
                {toNonBreaking(song.artist)}&nbsp;&bull;&#32;
                {toNonBreaking(song.title)}
            </H3>

            <SongActions songId={song.id} />

            <Body1 className='mt-12 whitespace-pre-wrap'>{song.lyrics}</Body1>
        </div>
    )
}
