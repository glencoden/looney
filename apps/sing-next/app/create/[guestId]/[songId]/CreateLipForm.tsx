'use client'

import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { createLipAction } from './actions'

export function CreateLipForm({
    sessionId,
    guestId,
    songId,
    songTitle,
    artistName,
}: {
    sessionId: string
    guestId: string
    songId: string
    songTitle: string
    artistName: string
}) {
    const t = useTranslations()
    const [isPending, startTransition] = useTransition()

    const onSubmit = (formData: FormData) => {
        startTransition(async () => {
            await createLipAction(formData)
        })
    }

    return (
        <form action={onSubmit} className='mx-6 mb-16 mt-7 flex flex-col gap-3'>
            <H3 className='mb-10 leading-10'>
                {t('create.heading', { songTitle, artistName })}
            </H3>

            <input type='hidden' name='sessionId' value={sessionId} />
            <input type='hidden' name='guestId' value={guestId} />
            <input type='hidden' name='songId' value={songId} />

            <section>
                <Subtitle2>{t('create.input.name')}</Subtitle2>
                <Input
                    type='text'
                    name='singerName'
                    aria-label='Singer name'
                    placeholder='Name'
                    disabled={isPending}
                />
            </section>

            <hr className='w-full border-2 border-transparent' />

            <Button type={isPending ? 'button' : 'submit'}>
                {t('create.button.submit')}
            </Button>
        </form>
    )
}
