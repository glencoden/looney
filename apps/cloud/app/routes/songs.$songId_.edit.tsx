import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { api } from '@repo/api/client'
import { SongSchema } from '@repo/db'
import { getSong, updateSong } from '@repo/db/queries'
import BoxFullHeightSlot from '@repo/ui/components/BoxFullHeightSlot'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import { Textarea } from '@repo/ui/components/Textarea'
import { cn } from '@repo/ui/helpers'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    redirect,
} from '@vercel/remix'
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
        genre: true,
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

    const { mutateAsync: findSyllables, isPending: isFindSyllablesPending } =
        api.openai.findSyllables.useMutation()

    const handleFindSyllablesButtonClick = async () => {
        const lyricsElement = document.getElementById('lyrics')

        if (!lyricsElement || !(lyricsElement instanceof HTMLTextAreaElement)) {
            throw new Error('Expect textarea with id "lyrics" to be present.')
        }

        const lyrics = lyricsElement.value
        const response = await findSyllables(lyrics)

        lyricsElement.value = response
    }

    const isLoading = navigation.state !== 'idle' || isFindSyllablesPending

    return (
        <BoxFullHeightSlot>
            <div
                className={cn('flex flex-col gap-4', {
                    'animate-pulse': isLoading,
                })}
            >
                <H3 className='h-9'>Edit Song</H3>

                <Form method='post' className='mt-5 flex flex-col gap-3'>
                    {isLoading ? (
                        <div className='flex gap-3'>
                            <Button type='button'>Save</Button>
                            <Button type='button' variant='secondary'>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <div className='flex gap-3'>
                            <Button type='submit'>Save</Button>
                            <Button asChild type='button' variant='secondary'>
                                <Link to={`/songs/${song.id}`}>Cancel</Link>
                            </Button>
                        </div>
                    )}

                    <section>
                        <Subtitle2>Artist</Subtitle2>
                        <Input
                            type='text'
                            name='artist'
                            aria-label='Artist name'
                            placeholder='Artist'
                            defaultValue={song.artist}
                            disabled={isLoading}
                        />
                    </section>

                    <section>
                        <Subtitle2>Title</Subtitle2>
                        <Input
                            type='text'
                            name='title'
                            aria-label='Song title'
                            placeholder='Title'
                            defaultValue={song.title}
                            disabled={isLoading}
                        />
                    </section>

                    <section>
                        <Subtitle2>Genre</Subtitle2>
                        <Input
                            type='text'
                            name='genre'
                            aria-label='Song genre'
                            placeholder='Genre'
                            defaultValue={song.genre ?? ''}
                            disabled={isLoading}
                        />
                    </section>

                    <hr className='w-full border-2 border-transparent' />

                    <section>
                        <Subtitle2>Lyrics</Subtitle2>

                        <Button
                            className='mt-2'
                            type='button'
                            size='sm'
                            onClick={handleFindSyllablesButtonClick}
                            disabled={isLoading && !isFindSyllablesPending}
                            loading={isFindSyllablesPending}
                        >
                            Find syllables
                        </Button>

                        <Textarea
                            id='lyrics'
                            className='mt-4'
                            defaultValue={song.lyrics}
                            aria-label='Lyrics'
                            name='lyrics'
                            placeholder='Lyrics'
                            disabled={isLoading}
                        />
                    </section>
                </Form>
            </div>
        </BoxFullHeightSlot>
    )
}
