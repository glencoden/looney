interface ButtonProps {
    secondary?: boolean
    isActive?: boolean
    label?: string
    onClick?: () => void
}

export function Button({
    secondary = false,
    isActive = false,
    label = 'no label',
    onClick,
}: ButtonProps) {
    const classes = [
        'button',
        secondary ? 'secondary-color' : 'primary-color',
        isActive ? 'button-active' : '',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button className={classes} onClick={onClick}>
            {label.toUpperCase()}
        </button>
    )
}
