'use client'

import H2 from '@repo/ui/typography/H2'
import { useSessionCountdown } from '@repo/utils/hooks'
import { useTranslations } from 'next-intl'

export function Countdown({ startsAt }: { startsAt: Date }) {
    const t = useTranslations()
    const countdown = useSessionCountdown(startsAt)

    if (!countdown) {
        return null
    }

    return (
        <div className='mobile-sim-height flex flex-col items-center justify-center'>
            <H2 className='px-6'>{t('root.countdown.headline')}</H2>
            <H2>{countdown}</H2>
        </div>
    )
}
