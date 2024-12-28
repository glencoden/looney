import type { ReactNode } from 'react'
import { cn } from '../helpers'

export default function Subtitle1({
    children,
    className,
}: Readonly<{
    children: ReactNode
    className?: string
}>) {
    return (
        <p
            className={cn(
                'text-lg font-bold leading-relaxed text-white',
                className,
            )}
        >
            {children}
        </p>
    )
}
