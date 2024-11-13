import type { ReactNode } from 'react'
import { cn } from '../helpers'

export default function H1({
    children,
    className,
    secondary = false,
    light = false,
}: Readonly<{
    children: ReactNode
    className?: string
    secondary?: boolean
    light?: boolean
}>) {
    return (
        <h1
            className={cn(
                'font-display animate-flicker-primary text-center text-5xl font-bold text-white',
                {
                    'animate-flicker-secondary': secondary,
                    'animate-flicker-light': light,
                },
                className,
            )}
        >
            {children}
        </h1>
    )
}
