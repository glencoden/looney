import { getSession } from '@repo/db/queries'
import { notFound } from 'next/navigation'
import { ActiveSession } from './ActiveSession'

export default async function SessionPage({
    params,
}: {
    params: Promise<{ sessionId: string }>
}) {
    const { sessionId } = await params
    const session = await getSession(sessionId)
    if (!session) notFound()

    return <ActiveSession initialSession={session} />
}
