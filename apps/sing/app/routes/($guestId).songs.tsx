import { useLoaderData } from '@remix-run/react'
import { api } from '@repo/api/client'
import SongLip from '@repo/ui/components/SongLip'
import Spinner from '@repo/ui/components/Spinner'
import H2 from '@repo/ui/typography/H2'
import { json, LoaderFunctionArgs } from '@vercel/remix'
import { useIntl } from 'react-intl'
import { z } from 'zod'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const guestId = z.string().parse(params.guestId)

    return json({ guestId })
}

export default function Songs() {
    const { guestId } = useLoaderData<typeof loader>()

    const intl = useIntl()

    const { data: lips, isLoading: isLipsLoading } =
        api.lip.getByGuestId.useQuery({ id: guestId })

    if (isLipsLoading || lips === undefined) {
        return (
            <div className='flex items-center justify-center py-20'>
                <Spinner light />
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center gap-3 pb-12'>
            {lips.length === 0 ? (
                <H2>
                    {intl.formatMessage({
                        id: 'songs.none.headline',
                        defaultMessage: 'You have no Songs yet',
                    })}
                </H2>
            ) : (
                <>
                    <H2 className='mb-4'>
                        {intl.formatMessage({
                            id: 'songs.some.headline',
                            defaultMessage: 'My Songs',
                        })}
                    </H2>
                    {lips
                        .filter(
                            (lip) =>
                                lip.status !== 'done' &&
                                lip.status !== 'deleted',
                        )
                        .map((lip) => (
                            <SongLip key={lip.id} lip={lip} hideTime />
                        ))}
                </>
            )}
        </div>
    )
}
