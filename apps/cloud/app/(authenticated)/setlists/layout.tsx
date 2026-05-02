import { getSetlists } from '@repo/db/queries'
import BoxMain from '@repo/ui/components/BoxMain'
import type { ReactNode } from 'react'
import { SetlistsSidebar } from './SetlistsSidebar'

export default async function SetlistsLayout({
    children,
}: {
    children: ReactNode
}) {
    const setlists = await getSetlists()

    return (
        <BoxMain>
            <SetlistsSidebar setlists={setlists}>{children}</SetlistsSidebar>
        </BoxMain>
    )
}
