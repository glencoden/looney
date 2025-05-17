import { useLoaderData } from '@remix-run/react'
import { getSongsCount } from '@repo/db/queries'
import { json } from '@vercel/remix'

export const loader = async () => {
    const songsCount = await getSongsCount()

    return json({ songsCount })
}

export default function Insights() {
    const { songsCount } = useLoaderData<typeof loader>()

    console.log(songsCount)

    return <div>Insights</div>
}
