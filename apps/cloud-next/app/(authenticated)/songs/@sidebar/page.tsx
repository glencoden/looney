import { getSongs } from '@repo/db/queries'
import { SongsSidebar } from '../SongsSidebar'

export default async function SongsSidebarSlot() {
    const songs = await getSongs()
    return <SongsSidebar songs={songs} />
}
