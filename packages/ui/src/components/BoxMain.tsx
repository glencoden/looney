import type { ReactNode } from 'react'
import { cn } from '../helpers'

export default function BoxMain({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <main
            className={cn(
                'px-main py-main container min-h-dvh overflow-hidden',
                className,
            )}
        >
            {children}
        </main>
    )
}
