import { getSong, getSongs } from '@repo/db/queries'
import { notFound } from 'next/navigation'
import { SongEditForm } from './SongEditForm'

export async function generateStaticParams() {
    const songs = await getSongs()
    return songs.map(({ id }) => ({ songId: id }))
}

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
