import { VerticalSpacer } from './VerticalSpacer'

interface Song {
    id: string
    artist: string
    title: string
    genre: string | null
    isFavorite: boolean
}

interface SongsPageProps {
    songs: Song[]
}

export function SongsPage({ songs }: SongsPageProps) {
    return (
        <>
            <VerticalSpacer />

            {songs.map((song) => {
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

            <VerticalSpacer />
        </>
    )
}
