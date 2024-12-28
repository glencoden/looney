import { ReactNode } from 'react'
import { cn } from '../helpers'

export default function H4({
    children,
    className,
}: Readonly<{ children: ReactNode; className?: string }>) {
    return (
        <h4
            className={cn(
                'font-display text-xl font-bold text-white',
                className,
            )}
        >
            {children}
        </h4>
    )
}
