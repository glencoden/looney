'use server'

import { SessionInsertSchema } from '@repo/db'
import { closeSession, createSession, deleteSession } from '@repo/db/queries'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const LIVE_SESSION_LENGTH = 1000 * 60 * 60 * 12

export async function createSessionAction(formData: FormData) {
    const title = formData.get('title')
    const setlistId = formData.get('setlistId')
    const startsAt = formData.get('startsAt')

    if (
        typeof title !== 'string' ||
        typeof setlistId !== 'string' ||
        typeof startsAt !== 'string'
    ) {
        throw new Error('Missing required fields')
    }

    // datetime-local has no timezone, so parse as UTC then shift by the client's
    // getTimezoneOffset() (positive for negative UTC offsets, e.g. +300 for UTC-5)
    // so the stored UTC instant matches the wall time the user picked locally.
    const rawStartDate = new Date(`${startsAt}Z`)
    const timezoneOffset = formData.get('timezoneOffset')
        ? Number(formData.get('timezoneOffset'))
        : 0
    const startDate = new Date(
        rawStartDate.getTime() + 1000 * 60 * timezoneOffset,
    )

    const id = await createSession(
        SessionInsertSchema.parse({
            title,
            setlistId,
            startsAt: startDate,
            endsAt: new Date(startDate.getTime() + LIVE_SESSION_LENGTH),
        }),
    )
    if (id === null) {
        throw new Error('Failed to create session')
    }

    revalidatePath('/')
    redirect(`/session/${id}`)
}

export async function closeSessionAction(sessionId: string) {
    const id = z.string().parse(sessionId)
    await closeSession(id)
    revalidatePath('/')
    revalidatePath(`/session/${id}`)
    redirect('/')
}

export async function deleteSessionAction(sessionId: string) {
    const id = z.string().parse(sessionId)
    await deleteSession(id)
    revalidatePath('/')
    revalidatePath(`/session/${id}`)
    redirect('/')
}
