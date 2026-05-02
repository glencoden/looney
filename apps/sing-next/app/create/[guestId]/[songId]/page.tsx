import { getGuest, getLipsByGuestId, getSong } from '@repo/db/queries'
import H2 from '@repo/ui/typography/H2'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { CreateLipForm } from './CreateLipForm'

export default async function CreatePage({
    params,
}: {
    params: Promise<{ guestId: string; songId: string }>
}) {
    const { guestId, songId } = await params

    const [guest, song, lips] = await Promise.all([
        getGuest(guestId),
        getSong(songId),
        getLipsByGuestId(guestId),
    ])

    if (!guest) notFound()
    if (!song) notFound()
    if (!guest.sessionId) notFound()

    const activeLips = lips.filter(
        (lip) => lip.status !== 'done' && lip.status !== 'deleted',
    )

    if (activeLips.length >= 3) {
        const t = await getTranslations()
        return (
            <div className='flex flex-col items-center gap-3'>
                <H2 className='leading-10'>{t('create.max.lips')}</H2>
            </div>
        )
    }

    return (
        <CreateLipForm
            sessionId={guest.sessionId}
            guestId={guestId}
            songId={songId}
            songTitle={song.title}
            artistName={song.artist}
        />
    )
}
