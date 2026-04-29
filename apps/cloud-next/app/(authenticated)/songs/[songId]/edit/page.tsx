import { getSong } from '@repo/db/queries'
import { notFound } from 'next/navigation'
import { SongEditForm } from './SongEditForm'

export default async function SongEditPage({
    params,
}: {
    params: Promise<{ songId: string }>
}) {
    const { songId } = await params
    const song = await getSong(songId)
    if (!song) notFound()

    return <SongEditForm song={song} />
}
