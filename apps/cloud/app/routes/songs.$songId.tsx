import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { getSong } from '@repo/db/queries'
import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import H3 from '@repo/ui/typography/H3'
import { toNonBreaking } from '@repo/utils/text'
import { ArrowLeft, Star } from 'lucide-react'
import { z } from 'zod'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const songId = z.string().parse(params.songId)
    const song = await getSong(songId)

    if (!song) {
        throw new Response('Not Found', { status: 404 })
    }

    return json({ song })
}

export default function Song() {
    const { song } = useLoaderData<typeof loader>()

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
                <Link to='/songs'>
                    <ArrowLeft className='h-6 w-6 text-white' />
                </Link>
            </Button>

            <Star
                className={cn('float-end h-8 w-8 text-blue-700', {
                    'fill-white text-white': song.isFavorite,
                })}
            />

            <H3 className='min-h-9 px-10'>
                {toNonBreaking(song.artist)}&nbsp;&bull;&#32;
                {toNonBreaking(song.title)}
            </H3>

            <section className='mt-8 grid grid-cols-2 gap-3'>
                {isLoading ? (
                    <Button>Edit</Button>
                ) : (
                    <Button asChild>
                        <Link to={`/songs/${song.id}/edit`}>Edit</Link>
                    </Button>
                )}

                <Form
                    action='destroy'
                    method='post'
                    onSubmit={(event) => {
                        const response = confirm(
                            'Please confirm you want to delete this song.',
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

            <Body1 className='mt-12 whitespace-pre-wrap'>{song.lyrics}</Body1>
        </div>
    )
}
