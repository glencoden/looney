import { useLoaderData, useNavigate } from '@remix-run/react'
import { createGuest } from '@repo/db/queries'
import H2 from '@repo/ui/typography/H2'
import { LoaderFunctionArgs } from '@vercel/remix'
import { useEffect } from 'react'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const resetId = params.resetId

    if (
        typeof resetId !== 'string' ||
        typeof process.env.SING_RESET_ID !== 'string' ||
        resetId !== process.env.SING_RESET_ID
    ) {
        return null
    }

    const guest = await createGuest()

    return { guest }
}

export default function Start() {
    const loaderData = useLoaderData<typeof loader>()

    const navigate = useNavigate()

    useEffect(() => {
        if (!loaderData?.guest?.id) {
            return
        }
        navigate(`/${loaderData.guest.id}`, { replace: true })
    }, [navigate, loaderData?.guest?.id])

    if (loaderData === null) {
        return (
            <div className='flex h-full items-center justify-center'>
                <H2>Unauthorized</H2>
            </div>
        )
    }

    if (loaderData.guest === null) {
        return (
            <div className='flex h-full items-center justify-center'>
                <H2>Couldn't create guest entry</H2>
            </div>
        )
    }

    return null
}
