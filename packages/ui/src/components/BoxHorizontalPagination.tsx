import { type ReactNode } from 'react'
import { cn } from '../helpers'

export default function BoxHorizontalPagination({
    children,
    className,
    isLeft,
}: {
    children: [ReactNode, ReactNode]
    className?: string
    isLeft: boolean
}) {
    return (
        <div
            className={cn(
                'max-lg:double-width relative gap-12 transition-transform duration-300 max-lg:grid max-lg:grid-cols-2 max-lg:justify-items-center md:gap-16 lg:flex',
                {
                    'max-lg:-translate-x-[100vw]': !isLeft,
                },
                className,
            )}
        >
            {children}
        </div>
    )
}
