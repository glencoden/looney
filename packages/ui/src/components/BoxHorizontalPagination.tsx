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
                'relative gap-12 transition-transform duration-300 max-lg:grid max-lg:grid-cols-2 max-lg:justify-items-center max-lg:[width:calc(200vw-theme(spacing.12))] md:gap-16 md:max-lg:[width:calc(200vw-theme(spacing.16))] lg:flex lg:max-lg:[width:calc(200vw-theme(spacing.32))]',
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
