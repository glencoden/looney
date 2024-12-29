import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../helpers'

const Input = forwardRef<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-12 w-full max-w-96 rounded-none border-4 border-black bg-white px-3 py-2 text-base font-medium text-black ring-offset-0 drop-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-normal placeholder:italic placeholder:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 disabled:cursor-not-allowed disabled:text-blue-300',
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})

Input.displayName = 'Input'

export default Input
