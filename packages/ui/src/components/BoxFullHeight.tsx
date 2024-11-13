import { Slot } from '@radix-ui/react-slot'
import type { ReactNode } from 'react'
import { cn } from '../helpers'

export default function BoxFullHeight({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <Slot className={cn('full-height flex-grow', className)}>
            {children}
        </Slot>
    )
}
