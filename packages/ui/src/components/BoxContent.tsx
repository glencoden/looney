import { Slot } from '@radix-ui/react-slot'
import type { ReactNode } from 'react'
import { cn } from '../helpers'

export default function BoxContent({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <Slot
            className={cn(
                'flex w-full flex-grow flex-col items-center justify-center',
                className,
            )}
        >
            {children}
        </Slot>
    )
}
