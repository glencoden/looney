import { useGet } from '../utils/useGet'
import { LoadingSpinner } from './LoadingSpinner'
import { VerticalSpacer } from './VerticalSpacer'

interface Song {
    id: string
    artist: string
    title: string
}

export function SongsPage() {
    const { data, error, isLoading } = useGet(
        'https://api.looneytunez.de/repertoire/published',
    )

    return (
        <>
            <VerticalSpacer />

            {isLoading && <LoadingSpinner />}

            {!isLoading && error && <pre>{JSON.stringify(error, null, 4)}</pre>}

            {!isLoading && !error && !Array.isArray(data?.data?.songs) && (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}

            {!isLoading && !error && Array.isArray(data?.data?.songs) && (
                <>
                    {data.data.songs.map((song: Song) => {
                        if (song.artist.length > 0 && song.title.length > 0) {
                            return (
                                <div key={song.id} className="song-box">
                                    <p className="artist-name">{song.artist}</p>
                                    <p className="song-title">{song.title}</p>
                                </div>
                            )
                        }
                        return null
                    })}
                </>
            )}

            <VerticalSpacer />
        </>
    )
}
