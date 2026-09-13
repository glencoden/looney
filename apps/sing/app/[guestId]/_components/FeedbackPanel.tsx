'use client'

import { api } from '@repo/api/client'
import Button from '@repo/ui/components/Button'
import Spinner from '@repo/ui/components/Spinner'
import { Textarea } from '@repo/ui/components/Textarea'
import H3 from '@repo/ui/typography/H3'
import { useTranslations } from 'next-intl'
import { useEffect, useState, useTransition } from 'react'
import { updateGuestFeedbackAction } from './actions'

export function FeedbackPanel({ guestId }: { guestId: string }) {
    const t = useTranslations()
    const utils = api.useUtils()
    const [isPending, startTransition] = useTransition()
    const [value, setValue] = useState<string | undefined>(undefined)

    const { data: guest, isLoading } = api.guest.get.useQuery({ id: guestId })

    useEffect(() => {
        if (isLoading || !guest || value !== undefined) return
        setValue(guest.feedback ?? '')
    }, [isLoading, guest, value])

    if (isLoading || guest === undefined) {
        return (
            <div className='flex items-center justify-center py-20'>
                <Spinner light />
            </div>
        )
    }

    if (guest === null) {
        throw new Error("Couldn't find guest.")
    }

    const onSubmit = (formData: FormData) => {
        startTransition(async () => {
            try {
                await updateGuestFeedbackAction(formData)
            } finally {
                await utils.guest.get.invalidate({ id: guestId })
            }
        })
    }

    return (
        <form action={onSubmit} className='mb-16 mt-7 flex flex-col gap-3'>
            <input type='hidden' name='guestId' value={guestId} />

            <H3 className='mb-10 leading-10'>{t('feedback.heading')}</H3>

            <Textarea
                id='feedback-input'
                className='focus-visible:ring-blue-300'
                aria-label='Feedback input'
                name='feedback'
                placeholder='Feedback'
                value={value ?? ''}
                onChange={({ target }) => setValue(target.value)}
            />

            <hr className='w-full border-2 border-transparent' />

            <Button type='submit' loading={isPending}>
                {guest.feedback
                    ? t('feedback.button.update')
                    : t('feedback.button.send')}
            </Button>
        </form>
    )
}
