import type { ReactNode } from 'react'
import { cn } from '../helpers'

export default function Subtitle2({
    children,
    className,
}: Readonly<{
    children: ReactNode
    className?: string
}>) {
    return (
        <p
            className={cn(
                'text-base font-medium uppercase leading-normal text-blue-300',
                className,
            )}
        >
            {children}
        </p>
    )
}
