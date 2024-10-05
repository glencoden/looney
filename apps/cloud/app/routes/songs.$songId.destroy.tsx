import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { deleteSong } from '@repo/db/queries'
import { z } from 'zod'

export const action = async ({ params }: ActionFunctionArgs) => {
    const songId = z.string().parse(params.songId)

    await deleteSong(songId)

    return redirect('/songs')
}
