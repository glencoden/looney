import { closeSession } from '@repo/db/queries'
import { ActionFunctionArgs, redirect } from '@vercel/remix'
import { z } from 'zod'

export const action = async ({ params }: ActionFunctionArgs) => {
    const sessionId = z.string().parse(params.sessionId)

    await closeSession(sessionId)

    return redirect('/')
}
