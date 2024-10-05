import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getSong } from '@repo/db/queries'
import { z } from 'zod'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const songId = z.string().parse(params.songId)
    const song = await getSong(songId)

    if (!song) {
        throw new Response('Not Found', { status: 404 })
    }

    return json({ song })
}

export default function SongsSongId() {
    const { song } = useLoaderData<typeof loader>()

    return (
        <div>
            <h2>{song.artist}</h2>
            <h3>{song.title}</h3>

            <p className='whitespace-pre'>{song.lyrics}</p>
        </div>
    )
}
