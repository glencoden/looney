import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { SongSchema } from '@repo/db'
import { getSong, updateSong } from '@repo/db/queries'
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

    const navigation = useNavigation()
    const isLoading = navigation.state !== 'idle'

    return (
        <div
            className={cn('flex h-[80vh] flex-grow flex-col space-y-4', {
                'animate-pulse': isLoading,
            })}
        >
            <h2>Edit Song</h2>

            <Form method='post' className='flex flex-grow flex-col gap-4'>
                <input
                    aria-label='Artist name'
                    defaultValue={song.artist}
                    name='artist'
                    placeholder='Artist'
                    type='text'
                    disabled={isLoading}
                />

                <input
                    aria-label='Song title'
                    defaultValue={song.title}
                    name='title'
                    placeholder='Title'
                    type='text'
                    disabled={isLoading}
                />

                <textarea
                    className='min-h-48 flex-grow'
                    defaultValue={song.lyrics}
                    aria-label='Lyrics'
                    name='lyrics'
                    placeholder='Lyrics'
                    disabled={isLoading}
                />

                {isLoading ? (
                    <div className='flex gap-3'>
                        <Button type='button'>Save</Button>
                        <Button type='button'>Cancel</Button>
                    </div>
                ) : (
                    <div className='flex gap-3'>
                        <Button type='submit'>Save</Button>
                        <Button asChild type='button'>
                            <Link to={`/songs/${song.id}`}>Cancel</Link>
                        </Button>
                    </div>
                )}
            </Form>
        </div>
    )
}
