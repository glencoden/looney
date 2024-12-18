import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { SongSchema } from '@repo/db'
import { getSong, updateSong } from '@repo/db/queries'
import BoxFullHeight from '@repo/ui/components/BoxFullHeight'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import { cn } from '@repo/ui/helpers'
import { useState } from 'react'
import { z } from 'zod'
import { SYLLABLE_CHAR } from '~/CONSTANTS'

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

    const [language, setLanguage] = useState('en-us')

    const findSyllables = () => {
        const lyricsElement = document.getElementById('lyrics')

        if (!lyricsElement || !(lyricsElement instanceof HTMLTextAreaElement)) {
            return
        }

        const lyrics = lyricsElement.value
        const consolidated = lyrics.replace(new RegExp(SYLLABLE_CHAR, 'g'), '')

        // @ts-expect-error Hyphenator is not typed
        lyricsElement.value = Hyphenator.hyphenate(consolidated, language)
    }

    return (
        <BoxFullHeight>
            <div
                className={cn('flex flex-col gap-4', {
                    'animate-pulse': isLoading,
                })}
            >
                <h2>Edit Song</h2>

                <Form method='post' className='flex flex-grow flex-col gap-4'>
                    <Input
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

                    <Button type='button' onClick={findSyllables}>
                        Find syllables
                    </Button>

                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value='en-us'>English</option>
                        <option value='en-gb'>English (UK)</option>
                        <option value='de'>German</option>
                    </select>

                    <textarea
                        id='lyrics'
                        className='min-h-[50vh] flex-grow'
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
        </BoxFullHeight>
    )
}
