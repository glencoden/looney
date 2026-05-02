import {
    getSetlist,
    getSongs,
    getSongsBySetlistId,
} from '@repo/db/queries'
import { notFound } from 'next/navigation'
import { SetlistEditClient } from './SetlistEditClient'

export default async function SetlistEditPage({
    params,
    searchParams,
}: {
    params: Promise<{ setlistId: string }>
    searchParams: Promise<{ q?: string }>
}) {
    const { setlistId } = await params
    const { q } = await searchParams

    const setlist = await getSetlist(setlistId)
    if (!setlist) notFound()

    const songs = await getSongs(q ?? null, false, true)
    const selectedSongs = await getSongsBySetlistId(setlistId)

    return (
        <SetlistEditClient
            setlist={setlist}
            songs={songs}
            selectedSongs={selectedSongs}
            initialQ={q ?? ''}
        />
    )
}
