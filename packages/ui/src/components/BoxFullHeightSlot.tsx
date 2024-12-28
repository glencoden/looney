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
        <Slot className={cn('full-height flex-grow max-lg:w-full', className)}>
            {children}
        </Slot>
    )
}
