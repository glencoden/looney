import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { deleteSetlist } from '@repo/db/queries'
import { z } from 'zod'

export const action = async ({ params }: ActionFunctionArgs) => {
    const setlistId = z.string().parse(params.setlistId)

    await deleteSetlist(setlistId)

    return redirect('/setlists')
}
