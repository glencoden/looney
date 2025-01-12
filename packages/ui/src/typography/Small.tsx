import type { ReactNode } from 'react'
import { cn } from '../helpers'

export default function Small({
    children,
    className,
}: Readonly<{
    children: ReactNode
    className?: string
}>) {
    return (
        <p
            className={cn(
                'text-xs font-medium leading-tight text-white',
                className,
            )}
        >
            {children}
        </p>
    )
}
