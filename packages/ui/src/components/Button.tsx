import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../helpers'
import Spinner from './Spinner'

export const buttonVariants = cva(
    'inline-flex select-none items-center justify-center whitespace-nowrap text-base font-semibold focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary:
                    'bg-blue-800 text-blue-300 active:bg-blue-700 hover:text-white lg:hover:animate-flicker-primary transition-colors transition-opacity duration-75 border-black drop-shadow border-4',
                secondary:
                    'bg-pink-600 text-pink-950 active:bg-pink-500 hover:text-white lg:hover:animate-flicker-secondary transition-colors transition-opacity duration-75 border-black drop-shadow border-4',
                light: 'bg-yellow-400 text-white active:bg-yellow-300 lg:hover:animate-flicker-light transition-colors transition-opacity duration-75 border-black drop-shadow border-4',
                ghost: '',
            },
            size: {
                primary: 'h-11 w-full max-w-96',
                sm: 'h-10 min-w-28 px-8',
                icon: 'h-6 w-6',
                auto: 'w-auto',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'primary',
        },
    },
)

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    loading?: boolean
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            loading = false,
            asChild = false,
            children,
            ...props
        },
        ref,
    ) => {
        if (loading) {
            return (
                <button
                    className={cn(buttonVariants({ variant, size, className }))}
                    {...props}
                    disabled
                >
                    <div className='flex w-full items-center justify-center'>
                        <Spinner
                            light={
                                variant !== 'secondary' && variant !== 'ghost'
                            }
                        />
                    </div>
                </button>
            )
        }

        const Component = asChild ? Slot : 'button'

        return (
            <Component
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {children}
            </Component>
        )
    },
)

Button.displayName = 'Button'

export default Button
