import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { SongInsertSchema } from '@repo/db'
import { createSong } from '@repo/db/queries'
import Button from '@repo/ui/Button'

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
    return (
        <div className='flex-grow'>
            <h2>Create Song</h2>

            <Form method='post' className='flex flex-col gap-4'>
                <input
                    aria-label='Artist name'
                    name='artist'
                    placeholder='Artist'
                    type='text'
                />

                <input
                    aria-label='Song title'
                    name='title'
                    placeholder='Title'
                    type='text'
                />

                <textarea
                    className='min-h-48'
                    aria-label='Lyrics'
                    name='lyrics'
                    placeholder='Lyrics'
                />

                <Button type='submit'>Create</Button>
                <Button asChild type='button'>
                    <Link to='/songs'>Cancel</Link>
                </Button>
            </Form>
        </div>
    )
}
