import { getSongs } from '@repo/db/queries'
import { SongsSidebar } from '../SongsSidebar'

export default async function SongsSidebarSlot({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const songs = await getSongs(q ?? null)

    return <SongsSidebar songs={songs} q={q ?? null} />
}
