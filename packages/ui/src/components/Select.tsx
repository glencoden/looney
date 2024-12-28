import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '../helpers'

const Select = forwardRef<
    HTMLSelectElement,
    SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
    return (
        <select
            className={cn(
                'h-11 w-full max-w-96 border-4 border-black bg-white px-3 py-1 text-base font-medium text-black ring-offset-0 drop-shadow placeholder:font-normal placeholder:italic placeholder:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 disabled:cursor-not-allowed disabled:text-blue-300',
                className,
            )}
            ref={ref}
            {...props}
        />
    )
})

Select.displayName = 'Select'

export default Select
