import { notFound } from 'next/navigation'
import { getCachedSongsWithLyrics } from '~/lib/cached-songs'
import { SongEditForm } from './SongEditForm'

export async function generateStaticParams() {
    const songs = await getCachedSongsWithLyrics()
    return songs.map(({ id }) => ({ songId: id }))
}

export default async function SongEditPage({
    params,
}: {
    params: Promise<{ songId: string }>
}) {
    const { songId } = await params
    const songs = await getCachedSongsWithLyrics()
    const song = songs.find((s) => s.id === songId)
    if (!song) notFound()

    return <SongEditForm song={song} />
}
