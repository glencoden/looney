import { ReactNode } from 'react'
import { cn } from '../helpers'

export default function H2({
    children,
    className,
}: Readonly<{ children: ReactNode; className?: string }>) {
    return (
        <h2
            className={cn(
                'font-display text-center text-3xl font-bold text-white',
                className,
            )}
        >
            {children}
        </h2>
    )
}
