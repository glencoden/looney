import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { getSong } from '@repo/db/queries'
import Button from '@repo/ui/Button'
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

    return (
        <div className='space-y-4'>
            <h2>{song.artist}</h2>
            <h3>{song.title}</h3>

            <p className='whitespace-pre'>{song.lyrics}</p>

            <Button asChild>
                <Link to={`/songs/${song.id}/edit`}>Edit</Link>
            </Button>

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
                <Button type='submit'>Delete</Button>
            </Form>
        </div>
    )
}
