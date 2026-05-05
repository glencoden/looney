'use server'

import { SongInsertSchema, SongSchema } from '@repo/db'
import { createSong, deleteSong, updateSong } from '@repo/db/queries'
import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { SONGS_CACHE_TAG } from '~/lib/cached-songs'

function revalidateSongs() {
    updateTag(SONGS_CACHE_TAG)
    revalidatePath('/songs', 'layout')
}

export async function toggleFavoriteAction(formData: FormData) {
    const songUpdate = SongSchema.pick({ id: true, isFavorite: true }).parse({
        id: formData.get('id'),
        isFavorite: formData.get('favorite') === 'true',
    })
    await updateSong(songUpdate)
    revalidateSongs()
}

export async function createSongAction(formData: FormData) {
    const id = await createSong(
        SongInsertSchema.parse(Object.fromEntries(formData)),
    )
    if (id === null) {
        throw new Error('Failed to create song')
    }
    revalidateSongs()
    redirect(`/songs/${id}`)
}

export async function updateSongAction(formData: FormData) {
    const songId = z.string().parse(formData.get('id'))
    const update = SongSchema.pick({
        id: true,
        artist: true,
        title: true,
        genre: true,
        lyrics: true,
    }).parse({
        id: songId,
        artist: formData.get('artist'),
        title: formData.get('title'),
        genre: formData.get('genre'),
        lyrics: formData.get('lyrics'),
    })
    await updateSong(update)
    revalidateSongs()
    redirect(`/songs/${songId}`)
}

export async function deleteSongAction(songId: string) {
    await deleteSong(z.string().parse(songId))
    revalidateSongs()
    redirect('/songs')
}
