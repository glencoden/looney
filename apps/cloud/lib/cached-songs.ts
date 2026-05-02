import { getSongs } from '@repo/db/queries'
import { unstable_cache } from 'next/cache'

export const SONGS_CACHE_TAG = 'songs'

type Song = {
    id: string
    artist: string
    title: string
    genre: string | null
    isFavorite: boolean
}

type SongWithLyrics = Song & { lyrics: string }

export const getCachedSongs = unstable_cache(
    () => getSongs() as Promise<Song[]>,
    ['songs-list'],
    { tags: [SONGS_CACHE_TAG] },
)

export const getCachedSongsWithLyrics = unstable_cache(
    () => getSongs(null, true) as Promise<SongWithLyrics[]>,
    ['songs-with-lyrics'],
    { tags: [SONGS_CACHE_TAG] },
)
