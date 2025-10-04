interface InputTextProps {
    value: string
    onChange: (value: string) => void
}

export function InputText({ value, onChange }: InputTextProps) {
    const handleFocus = () => {
        onChange('')
    }

    return (
        <input
            className='w-full border-[--border-width-default] border-[--color-brand-black] p-[calc(0.5*var(--spacing-padding))] font-sans text-[--font-size-m] outline-none'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
        />
    )
}
