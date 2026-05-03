import H2 from '@repo/ui/typography/H2'
import { getTranslations } from 'next-intl/server'

export default async function RootPage() {
    const t = await getTranslations()
    return (
        <div className='mobile-sim-height flex items-center justify-center'>
            <H2>{t('root.waiting.headline')}</H2>
        </div>
    )
}
