'use client'

import BoxHorizontalPagination from '@repo/ui/components/BoxHorizontalPagination'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function SongsLayoutShell({
    sidebar,
    children,
}: {
    sidebar: ReactNode
    children: ReactNode
}) {
    const pathname = usePathname()

    return (
        <BoxHorizontalPagination isLeft={pathname === '/songs'}>
            {sidebar}
            {children}
        </BoxHorizontalPagination>
    )
}
