import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { SongSchema } from '@repo/db'
import { getSong, updateSong } from '@repo/db/queries'
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

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const songId = z.string().parse(params.songId)
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData)
    const songUpdate = SongSchema.pick({
        id: true,
        artist: true,
        title: true,
        lyrics: true,
    }).parse({
        id: songId,
        ...formValues,
    })

    await updateSong(songUpdate)

    return redirect(`/songs/${songId}`)
}

export default function SongEdit() {
    const { song } = useLoaderData<typeof loader>()

    return (
        <div className='flex h-[80vh] flex-grow flex-col space-y-4'>
            <h2>Edit Song</h2>

            <Form method='post' className='flex flex-grow flex-col gap-4'>
                <input
                    aria-label='Artist name'
                    defaultValue={song.artist}
                    name='artist'
                    placeholder='Artist'
                    type='text'
                />

                <input
                    aria-label='Song title'
                    defaultValue={song.title}
                    name='title'
                    placeholder='Title'
                    type='text'
                />

                <textarea
                    className='min-h-48 flex-grow'
                    defaultValue={song.lyrics}
                    aria-label='Lyrics'
                    name='lyrics'
                    placeholder='Lyrics'
                />

                <Button type='submit'>Update</Button>
                <Button asChild type='button'>
                    <Link to={`/songs/${song.id}`}>Cancel</Link>
                </Button>
            </Form>
        </div>
    )
}
