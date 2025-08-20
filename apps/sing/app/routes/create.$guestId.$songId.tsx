import {
    Form,
    redirect,
    useLoaderData,
    useNavigation,
    ActionFunctionArgs,
    LoaderFunctionArgs,
} from 'react-router'
import { api } from '@repo/api/client'
import { LipInsertSchema } from '@repo/db'
import { createLip } from '@repo/db/queries'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import Spinner from '@repo/ui/components/Spinner'
import H2 from '@repo/ui/typography/H2'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { toNonBreaking } from '@repo/utils/text'
import { useIntl } from 'react-intl'
import { z } from 'zod'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const guestId = z.string().parse(params.guestId)
    const songId = z.string().parse(params.songId)

    return { guestId, songId }
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData)

    await createLip(LipInsertSchema.parse(formValues))

    return redirect(`/${formValues.guestId}/songs`)
}

export default function Create() {
    const { guestId, songId } = useLoaderData<typeof loader>()

    const { data: guest, isLoading: isGuestLoading } = api.guest.get.useQuery({
        id: guestId,
    })

    const { data: song, isLoading: isSongLoading } = api.song.getById.useQuery({
        id: songId,
    })

    const { data: lips, isLoading: isLipsLoading } =
        api.lip.getByGuestId.useQuery({ id: guestId })

    const intl = useIntl()

    const navigation = useNavigation()
    const isLoading = navigation.state !== 'idle'

    if (
        isGuestLoading ||
        guest === undefined ||
        isSongLoading ||
        song === undefined ||
        isLipsLoading ||
        lips === undefined
    ) {
        return (
            <div className='flex items-center justify-center py-20'>
                <Spinner light />
            </div>
        )
    }

    if (guest === null) {
        throw new Error(`Couldn't find guest.`)
    }

    if (song === null) {
        throw new Error(`Couldn't find song.`)
    }

    if (
        lips.filter((lip) => lip.status !== 'done' && lip.status !== 'deleted')
            .length >= 3
    ) {
        return (
            <div className='flex flex-col items-center gap-3'>
                <H2 className='leading-10'>
                    {intl.formatMessage({
                        id: 'create.max.lips',
                        defaultMessage:
                            'You can only sign up for 3 songs at a time.',
                    })}
                </H2>
            </div>
        )
    }

    return (
        <Form method='post' className='mx-6 mb-16 mt-7 flex flex-col gap-3'>
            <H3 className='mb-10 leading-10'>
                {intl.formatMessage(
                    {
                        id: 'create.heading',
                        defaultMessage: 'Sing {songTitle} by {artistName}',
                    },
                    {
                        songTitle: toNonBreaking(song.title),
                        artistName: toNonBreaking(song.artist),
                    },
                )}
            </H3>

            <Input
                type='hidden'
                name='sessionId'
                value={guest.sessionId as string}
            />

            <Input type='hidden' name='guestId' value={guestId} />

            <Input type='hidden' name='songId' value={songId} />

            <section>
                <Subtitle2>
                    {intl.formatMessage({
                        id: 'create.input.name',
                        defaultMessage: `What's your name?`,
                    })}
                </Subtitle2>
                <Input
                    type='text'
                    name='singerName'
                    aria-label='Singer name'
                    placeholder='Name'
                    disabled={isLoading}
                />
            </section>

            <hr className='w-full border-2 border-transparent' />

            <Button type={isLoading ? 'button' : 'submit'}>
                {intl.formatMessage({
                    id: 'create.button.submit',
                    defaultMessage: `Let's go!`,
                })}
            </Button>
        </Form>
    )
}
