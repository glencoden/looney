import { getSetlist, getSongsBySetlistId } from '@repo/db/queries'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H3 from '@repo/ui/typography/H3'
import H4 from '@repo/ui/typography/H4'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { toNonBreaking } from '@repo/utils/text'
import { AudioLines } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SetlistActions, SetlistBackButton } from './SetlistActions'

export default async function SetlistDetailPage({
    params,
}: {
    params: Promise<{ setlistId: string }>
}) {
    const { setlistId } = await params
    const setlist = await getSetlist(setlistId)
    if (!setlist) notFound()

    const songs = await getSongsBySetlistId(setlistId)

    return (
        <div className='flex-grow max-lg:w-full'>
            <SetlistBackButton />

            <Subtitle2 className='float-end flex items-center gap-1'>
                {songs.length}
                <AudioLines className='h-4 w-4' />
            </Subtitle2>

            <H3 className='min-h-9 px-10'>{toNonBreaking(setlist.title)}</H3>

            <SetlistActions setlistId={setlist.id} />

            <ul className='mt-8 space-y-2'>
                {songs.length > 0 ? (
                    songs.map(({ id, artist, title, genre }, index) => (
                        <li key={id}>
                            {songs[index - 1]?.genre !== genre && (
                                <H4 className='mb-2 mt-6 text-blue-300'>
                                    {genre ?? 'Unknown'}
                                </H4>
                            )}
                            <div>
                                <Body2 className='inline'>
                                    {toNonBreaking(artist)}
                                </Body2>
                                &nbsp;&bull;&#32;
                                <Body1 className='inline'>
                                    {toNonBreaking(title)}
                                </Body1>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>
                        <Body1>No songs in this setlist.</Body1>
                    </li>
                )}
            </ul>
        </div>
    )
}
