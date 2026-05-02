import { getSetlists } from '@repo/db/queries'
import { SessionStartForm } from './SessionStartForm'

export default async function SessionStartPage() {
    const setlists = await getSetlists()
    return <SessionStartForm setlists={setlists} />
}
