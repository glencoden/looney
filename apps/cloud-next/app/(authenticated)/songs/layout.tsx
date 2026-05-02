import BoxMain from '@repo/ui/components/BoxMain'
import type { ReactNode } from 'react'
import { SongsLayoutShell } from './SongsLayoutShell'

export default function SongsLayout({
    children,
    sidebar,
}: {
    children: ReactNode
    sidebar: ReactNode
}) {
    return (
        <BoxMain>
            <SongsLayoutShell sidebar={sidebar}>{children}</SongsLayoutShell>
        </BoxMain>
    )
}
