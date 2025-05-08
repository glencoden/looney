import { Form, Link } from '@remix-run/react'

import { useLoaderData, useNavigation } from '@remix-run/react'
import { getSetlist, getSongsBySetlistId } from '@repo/db/queries'
import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H3 from '@repo/ui/typography/H3'
import H4 from '@repo/ui/typography/H4'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { toNonBreaking } from '@repo/utils/text'
import { json, LoaderFunctionArgs } from '@vercel/remix'
import { ArrowLeft, AudioLines } from 'lucide-react'
import { z } from 'zod'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const setlistId = z.string().parse(params.setlistId)

    const setlist = await getSetlist(setlistId)

    if (!setlist) {
        throw new Response('Not Found', { status: 404 })
    }

    const songs = await getSongsBySetlistId(setlistId)

    return json({ setlist, songs })
}

export default function Setlist() {
    const { setlist, songs } = useLoaderData<typeof loader>()

    const navigation = useNavigation()
    const isLoading = navigation.state !== 'idle'

    return (
        <div
            className={cn('flex-grow max-lg:w-full', {
                'animate-pulse': isLoading,
            })}
        >
            <Button
                asChild
                className='float-start lg:hidden'
                variant='ghost'
                size='icon'
                disabled={isLoading}
            >
                <Link to='/setlists'>
                    <ArrowLeft className='h-6 w-6 text-white' />
                </Link>
            </Button>

            <Subtitle2 className='float-end flex items-center gap-1'>
                {songs.length}
                <AudioLines className='h-4 w-4' />
            </Subtitle2>

            <H3 className='min-h-9 px-10'>{toNonBreaking(setlist.title)}</H3>

            <section className='mt-8 grid grid-cols-2 gap-3'>
                {isLoading ? (
                    <Button>Edit</Button>
                ) : (
                    <Button asChild>
                        <Link to={`/setlists/${setlist.id}/edit`}>Edit</Link>
                    </Button>
                )}

                <Form
                    action='destroy'
                    method='post'
                    onSubmit={(event) => {
                        const response = confirm(
                            'Please confirm you want to delete this setlist.',
                        )
                        if (!response) {
                            event.preventDefault()
                        }
                    }}
                >
                    {isLoading ? (
                        <Button variant='secondary' type='button'>
                            Delete
                        </Button>
                    ) : (
                        <Button variant='secondary' type='submit'>
                            Delete
                        </Button>
                    )}
                </Form>
            </section>

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
