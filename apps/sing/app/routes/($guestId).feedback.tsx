import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { api } from '@repo/api/client'
import Button from '@repo/ui/components/Button'
import Spinner from '@repo/ui/components/Spinner'
import { Textarea } from '@repo/ui/components/Textarea'
import H3 from '@repo/ui/typography/H3'
import { useLayoutEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { z } from 'zod'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const guestId = z.string().parse(params.guestId)

    return json({ guestId })
}

export default function Feedback() {
    const { guestId } = useLoaderData<typeof loader>()

    const intl = useIntl()
    const utils = api.useUtils()

    const {
        data: guest,
        isLoading: isGuestLoading,
        isFetching: isGuestFetching,
    } = api.guest.get.useQuery({
        id: guestId,
    })

    const [inputValue, setInputValue] = useState<string>()

    useLayoutEffect(() => {
        if (isGuestLoading || isGuestFetching) {
            return
        }
        setInputValue(guest?.feedback ?? '')
    }, [isGuestLoading, isGuestFetching, guest?.feedback])

    const { mutate: updateGuest, isPending } = api.guest.update.useMutation({
        onSuccess: () => {
            void utils.guest.get.invalidate({ id: guestId })
        },
    })

    const handleSendButtonClick = () => {
        updateGuest({
            id: guestId,
            feedback: inputValue,
        })
    }

    if (isGuestLoading || guest === undefined) {
        return (
            <div className='flex items-center justify-center py-20'>
                <Spinner light />
            </div>
        )
    }

    if (guest === null) {
        throw new Error(`Couldn't find guest.`)
    }

    return (
        <div className='mb-16 mt-7 flex flex-col gap-3'>
            <H3 className='mb-10 leading-10'>
                {intl.formatMessage({
                    id: 'feedback.heading',
                    defaultMessage: 'Tell us about your experience',
                })}
            </H3>

            <Textarea
                id='feedback-input'
                className='focus-visible:ring-blue-300'
                aria-label='Feedback input'
                name='feedback'
                placeholder='Feedback'
                defaultValue='Feedback'
                value={inputValue}
                onChange={({ target }) => setInputValue(target.value)}
            />

            <hr className='w-full border-2 border-transparent' />

            <Button onClick={handleSendButtonClick} loading={isPending}>
                {guest.feedback
                    ? intl.formatMessage({
                          id: 'feedback.button.update',
                          defaultMessage: 'Update',
                      })
                    : intl.formatMessage({
                          id: 'feedback.button.send',
                          defaultMessage: 'Send',
                      })}
            </Button>
        </div>
    )
}
