import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link, useNavigation } from '@remix-run/react'
import { SongInsertSchema } from '@repo/db'
import { createSong } from '@repo/db/queries'
import Button from '@repo/ui/Button'
import { cn } from '@repo/ui/helpers'

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const songInsert = SongInsertSchema.parse(Object.fromEntries(formData))

    const id = await createSong(songInsert)

    if (id === null) {
        throw new Response('Failed to create song', { status: 500 })
    }

    return redirect(`/songs/${id}`)
}

export default function SongsCreate() {
    const navigation = useNavigation()
    const isLoading = navigation.state !== 'idle'

    return (
        <div
            className={cn('flex-grow', {
                'animate-pulse': isLoading,
            })}
        >
            <h2>New Song</h2>

            <Form method='post' className='flex flex-col gap-4'>
                <input
                    aria-label='Artist name'
                    name='artist'
                    placeholder='Artist'
                    type='text'
                    disabled={isLoading}
                />

                <input
                    aria-label='Song title'
                    name='title'
                    placeholder='Title'
                    type='text'
                    disabled={isLoading}
                />

                <textarea
                    className='min-h-48'
                    aria-label='Lyrics'
                    name='lyrics'
                    placeholder='Lyrics'
                    disabled={isLoading}
                />

                {isLoading ? (
                    <div className='flex gap-3'>
                        <Button type='button'>Create</Button>
                        <Button type='button'>Cancel</Button>
                    </div>
                ) : (
                    <div className='flex gap-3'>
                        <Button type='submit'>Create</Button>
                        <Button asChild type='button'>
                            <Link to='/songs'>Cancel</Link>
                        </Button>
                    </div>
                )}
            </Form>
        </div>
    )
}
