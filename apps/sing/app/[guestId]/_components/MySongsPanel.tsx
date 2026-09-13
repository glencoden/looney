'use client'

import { api } from '@repo/api/client'
import SongLip from '@repo/ui/components/SongLip'
import Spinner from '@repo/ui/components/Spinner'
import H2 from '@repo/ui/typography/H2'
import { useTranslations } from 'next-intl'

export function MySongsPanel({ guestId }: { guestId: string }) {
    const t = useTranslations()

    const { data: lips, isLoading } = api.lip.getByGuestId.useQuery({
        id: guestId,
    })

    if (isLoading || lips === undefined) {
        return (
            <div className='flex items-center justify-center py-20'>
                <Spinner light />
            </div>
        )
    }

    const visibleLips = lips.filter(
        (lip) => lip.status !== 'done' && lip.status !== 'deleted',
    )

    if (visibleLips.length === 0) {
        return (
            <div className='flex flex-col items-center gap-3 pb-12'>
                <H2>{t('songs.none.headline')}</H2>
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center gap-3 pb-12'>
            <H2 className='mb-4'>{t('songs.some.headline')}</H2>
            {visibleLips.map((lip) => (
                <SongLip key={lip.id} lip={lip} hideTime />
            ))}
        </div>
    )
}
