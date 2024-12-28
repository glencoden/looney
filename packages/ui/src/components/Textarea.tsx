import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../helpers'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'field-content flex min-h-[42vh] w-full border-4 border-black bg-white px-3 py-2 text-base font-medium text-black ring-offset-0 drop-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-normal placeholder:italic placeholder:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 disabled:cursor-not-allowed disabled:text-blue-300',
                    className,
                )}
                ref={ref}
                {...props}
            />
        )
    },
)

Textarea.displayName = 'Textarea'

export { Textarea }
