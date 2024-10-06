import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { getSong } from '@repo/db/queries'
import Button from '@repo/ui/Button'
import { cn } from '@repo/ui/helpers'
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
            className={cn('space-y-4', {
                'animate-pulse': isLoading,
            })}
        >
            {isLoading ? (
                <Button>Back (mobile)</Button>
            ) : (
                <Button asChild>
                    <Link to='/songs'>Back (mobile)</Link>
                </Button>
            )}

            <section className='flex gap-3'>
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
                        <Button type='button'>Delete</Button>
                    ) : (
                        <Button type='submit'>Delete</Button>
                    )}
                </Form>
            </section>

            <h2>{song.artist}</h2>
            <h3>{song.title}</h3>

            <p className='whitespace-pre'>{song.lyrics}</p>
        </div>
    )
}
