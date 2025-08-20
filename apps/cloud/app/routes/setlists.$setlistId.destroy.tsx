import { deleteSetlist } from '@repo/db/queries'
import { ActionFunctionArgs, redirect } from 'react-router'
import { z } from 'zod'

export const action = async ({ params }: ActionFunctionArgs) => {
    const setlistId = z.string().parse(params.setlistId)

    await deleteSetlist(setlistId)

    return redirect('/setlists')
}
