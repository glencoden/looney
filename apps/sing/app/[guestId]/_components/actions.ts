'use server'

import { updateGuest } from '@repo/db/queries'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const Schema = z.object({
    guestId: z.string(),
    feedback: z.string().max(2000),
})

export async function updateGuestFeedbackAction(formData: FormData) {
    const { guestId, feedback } = Schema.parse({
        guestId: formData.get('guestId'),
        feedback: formData.get('feedback'),
    })

    await updateGuest({ id: guestId, feedback })
    revalidatePath(`/${guestId}`)
}
