import { Slot } from '@radix-ui/react-slot'
import type { ReactNode } from 'react'
import { cn } from '../helpers'

export default function BoxFullHeightSlot({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <Slot
            className={cn(
                'flex-grow [height:calc(100dvh-theme(spacing.24))] max-lg:w-full md:[height:calc(100dvh-theme(spacing.32))]',
                className,
            )}
        >
            {children}
        </Slot>
    )
}
