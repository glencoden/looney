import { getSetlists } from '@repo/db/queries'
import { SetlistCreateForm } from './SetlistCreateForm'

export default async function SetlistCreatePage() {
    const setlists = await getSetlists()

    return <SetlistCreateForm setlists={setlists} />
}
