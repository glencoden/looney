'use client'

import { api } from '@repo/api/client'
import BoxFullHeightSlot from '@repo/ui/components/BoxFullHeightSlot'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import { Textarea } from '@repo/ui/components/Textarea'
import { cn } from '@repo/ui/helpers'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import Link from 'next/link'
import { useTransition } from 'react'
import { updateSongAction } from '../../actions'

type Song = {
    id: string
    artist: string
    title: string
    genre: string | null
    lyrics: string
}

export function SongEditForm({ song }: { song: Song }) {
    const [isPending, startTransition] = useTransition()

    const { mutateAsync: findSyllables, isPending: isFindSyllablesPending } =
        api.openai.findSyllables.useMutation()

    const handleFindSyllablesButtonClick = async () => {
        const lyricsElement = document.getElementById('lyrics')
        if (!(lyricsElement instanceof HTMLTextAreaElement)) {
            throw new Error('Expect textarea with id "lyrics" to be present.')
        }
        const response = await findSyllables(lyricsElement.value)
        lyricsElement.value = response
    }

    const isLoading = isPending || isFindSyllablesPending

    return (
        <BoxFullHeightSlot>
            <div
                className={cn('flex flex-col gap-4', {
                    'animate-pulse': isLoading,
                })}
            >
                <H3 className='h-9'>Edit Song</H3>

                <form
                    action={(formData) =>
                        startTransition(() => updateSongAction(formData))
                    }
                    className='mt-5 flex flex-col gap-3'
                >
                    <input type='hidden' name='id' value={song.id} />
                    <div className='flex gap-3'>
                        <Button type='submit' disabled={isLoading}>
                            Save
                        </Button>
                        <Button
                            asChild
                            type='button'
                            variant='secondary'
                            disabled={isLoading}
                        >
                            <Link href={`/songs/${song.id}`}>Cancel</Link>
                        </Button>
                    </div>

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
                </form>
            </div>
        </BoxFullHeightSlot>
    )
}
