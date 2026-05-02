'use server'

import { LipInsertSchema } from '@repo/db'
import { createLip } from '@repo/db/queries'
import { redirect } from 'next/navigation'

export async function createLipAction(formData: FormData) {
    const parsed = LipInsertSchema.parse({
        sessionId: formData.get('sessionId'),
        guestId: formData.get('guestId'),
        songId: formData.get('songId'),
        singerName: formData.get('singerName'),
    })

    await createLip(parsed)
    redirect(`/${parsed.guestId}/songs`)
}
