import { ReactNode } from 'react'
import { cn } from '../helpers'

export default function Body1({
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
                'text-base font-normal leading-relaxed text-white',
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
