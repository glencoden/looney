import { ReactNode } from 'react'
import { cn } from '../helpers'

export default function H3({
    children,
    className,
}: Readonly<{ children: ReactNode; className?: string }>) {
    return (
        <h3
            className={cn(
                'font-display text-center text-2xl font-bold text-white',
                className,
            )}
        >
            {children}
        </h3>
    )
}
