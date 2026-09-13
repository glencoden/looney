'use server'

import {
    SetlistInsertSchema,
    SetlistToSongInsertSchema,
    SetlistToSongSchema,
} from '@repo/db'
import {
    addSongToSetlist,
    copySongsToSetlist,
    createSetlist,
    deleteSetlist,
    removeSongFromSetlist,
} from '@repo/db/queries'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requirePermission } from '~/lib/require-permission'

export async function createSetlistAction(formData: FormData) {
    await requirePermission('admin')
    const id = await createSetlist(
        SetlistInsertSchema.parse({ title: formData.get('title') }),
    )
    if (id === null) {
        throw new Error('Failed to create setlist')
    }
    const fromSetlistId = formData.get('fromSetlistId')
    if (fromSetlistId && typeof fromSetlistId === 'string') {
        await copySongsToSetlist(fromSetlistId, id)
    }
    revalidatePath('/setlists', 'layout')
    revalidatePath('/session')
    redirect(`/setlists/${id}`)
}

export async function deleteSetlistAction(setlistId: string) {
    await requirePermission('admin')
    await deleteSetlist(z.string().parse(setlistId))
    revalidatePath('/setlists', 'layout')
    revalidatePath('/session')
    redirect('/setlists')
}

export async function toggleSongInSetlistAction(formData: FormData) {
    await requirePermission('admin')
    const setlistId = z.string().parse(formData.get('setlistId'))
    const songId = z.string().parse(formData.get('songId'))
    const selected = formData.get('selected') === 'true'

    if (!selected) {
        await removeSongFromSetlist(
            SetlistToSongSchema.parse({ setlistId, songId }),
        )
    } else {
        await addSongToSetlist(
            SetlistToSongInsertSchema.parse({ setlistId, songId }),
        )
    }
    revalidatePath(`/setlists/${setlistId}`)
    revalidatePath(`/setlists/${setlistId}/edit`)
}
