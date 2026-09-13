import { createGuest } from '@repo/db/queries'
import H2 from '@repo/ui/typography/H2'
import { redirect } from 'next/navigation'

export default async function StartPage({
    params,
}: {
    params: Promise<{ resetId: string }>
}) {
    const { resetId } = await params

    if (
        typeof process.env.SING_RESET_ID !== 'string' ||
        resetId !== process.env.SING_RESET_ID
    ) {
        return (
            <div className='flex h-full items-center justify-center'>
                <H2>Unauthorized</H2>
            </div>
        )
    }

    const guest = await createGuest()

    if (!guest) {
        return (
            <div className='flex h-full items-center justify-center'>
                <H2>Couldn&apos;t create guest entry</H2>
            </div>
        )
    }

    redirect(`/${guest.id}`)
}
