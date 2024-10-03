import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './helpers/cn'
import Spinner from './Spinner'

export const buttonVariants = cva(
    'inline-flex select-none items-center justify-center whitespace-nowrap rounded-lg text-base font-semibold focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none ',
    {
        variants: {
            variant: {
                default:
                    'bg-green-300 text-amber-800 active:bg-slate-500 hover:bg-slate-500 transition-colors transition-opacity duration-75',
                secondary:
                    'bg-white border border-slate-800 text-slate-800 active:bg-slate-300 hover:bg-slate-300 font-medium uppercase disabled:bg-slate-100 disabled:text-slate-300 disabled:border-none transition-colors transition-opacity duration-75',
                light: 'bg-white text-slate-800 active:bg-slate-300 hover:bg-slate-300 transition-colors transition-opacity duration-75',
                answer: 'justify-start bg-white font-medium text-sm text-slate-800 px-4 shadow transition-colors transition-opacity duration-75',
                underline:
                    'text-slate-800 border-none font-medium underline leading-normal transition-colors transition-opacity duration-75',
                skeleton: 'animate-pulse bg-slate-200',
                ghost: '',
            },
            size: {
                default: 'h-11 w-full max-w-96',
                sm: 'h-10 min-w-28 px-8',
                icon: 'h-6 w-6',
                answer: 'h-11 w-full max-w-96',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
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
                                variant !== 'secondary' &&
                                variant !== 'light' &&
                                variant !== 'answer' &&
                                variant !== 'underline'
                            }
                        />
                    </div>
                </button>
            )
        }

        const Component = asChild ? Slot : 'button'

        return (
            <Component
                className={cn(buttonVariants({ variant, size, className }), {
                    'disabled:bg-slate-300': variant !== 'ghost',
                })}
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
