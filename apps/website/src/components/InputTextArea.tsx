interface InputTextAreaProps {
    value: string
    onChange: (value: string) => void
}

export function InputTextArea({ value, onChange }: InputTextAreaProps) {
    const handleFocus = () => {
        onChange('')
    }

    return (
        <textarea
            className='h-full w-full resize-none border-[--border-width-default] border-[--color-brand-black] p-[calc(0.5*var(--spacing-padding))] font-sans text-[--font-size-m] outline-none'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
        />
    )
}
