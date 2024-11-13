import { ReactNode } from 'react'
import { cn } from '../helpers'

export default function Body2({
    children,
    className,
    dark,
}: Readonly<{
    children: ReactNode
    className?: string
    dark?: boolean
}>) {
    return (
        <p
            className={cn(
                'text-base font-medium leading-7 text-white',
                className,
                {
                    'text-black': dark,
                },
            )}
        >
            {children}
        </p>
    )
}
