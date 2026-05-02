import { getCachedSongs } from '~/lib/cached-songs'
import { SongsSidebar } from '../SongsSidebar'

export default async function SongsSidebarSlot() {
    const songs = await getCachedSongs()
    return <SongsSidebar songs={songs} />
}
