import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link, useNavigation } from '@remix-run/react'
import { api } from '@repo/api/client'
import { SongInsertSchema } from '@repo/db'
import { createSong } from '@repo/db/queries'
import BoxFullHeightSlot from '@repo/ui/components/BoxFullHeightSlot'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import { Textarea } from '@repo/ui/components/Textarea'
import { cn } from '@repo/ui/helpers'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData)

    const id = await createSong(SongInsertSchema.parse(formValues))

    if (id === null) {
        throw new Response('Failed to create song', { status: 500 })
    }

    return redirect(`/songs/${id}`)
}

export default function SongsCreate() {
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
                <H3 className='h-9'>New Song</H3>

                <Form method='post' className='mt-4 flex flex-col gap-3'>
                    <section>
                        <Subtitle2>Artist</Subtitle2>
                        <Input
                            aria-label='Artist name'
                            name='artist'
                            placeholder='Artist'
                            type='text'
                            disabled={isLoading}
                        />
                    </section>

                    <section>
                        <Subtitle2>Title</Subtitle2>
                        <Input
                            aria-label='Song title'
                            name='title'
                            placeholder='Title'
                            type='text'
                            disabled={isLoading}
                        />
                    </section>

                    <section>
                        <Subtitle2>Genre</Subtitle2>
                        <Input
                            aria-label='Song genre'
                            name='genre'
                            placeholder='Genre'
                            type='text'
                            disabled={isLoading}
                        />
                    </section>

                    <hr className='w-full border-2 border-transparent' />

                    <section>
                        <Subtitle2>Lyrics</Subtitle2>

                        <Button
                            className='mt-2'
                            type='button'
                            onClick={handleFindSyllablesButtonClick}
                            disabled={isLoading && !isFindSyllablesPending}
                            loading={isFindSyllablesPending}
                        >
                            Find syllables
                        </Button>

                        <Textarea
                            id='lyrics'
                            className='mt-4'
                            aria-label='Lyrics'
                            name='lyrics'
                            placeholder='Lyrics'
                            disabled={isLoading}
                        />
                    </section>

                    <hr className='w-full border-2 border-transparent' />

                    {isLoading ? (
                        <div className='flex gap-3'>
                            <Button type='button'>Create</Button>
                            <Button type='button' variant='secondary'>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <div className='flex gap-3'>
                            <Button type='submit'>Create</Button>
                            <Button asChild type='button' variant='secondary'>
                                <Link to='/songs'>Cancel</Link>
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </BoxFullHeightSlot>
    )
}
