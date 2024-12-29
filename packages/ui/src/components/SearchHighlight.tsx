export default function SearchHighlight({
    text,
    searchString,
}: Readonly<{
    text: string
    searchString: string | null
}>) {
    if (!searchString) {
        return <>{text}</>
    }

    const regex = new RegExp(searchString, 'gi')

    const highlights = text.match(regex) || []
    const parts = text.split(regex)

    return (
        <>
            {parts.map((part, index) => {
                const highlight = highlights[index]

                return (
                    <span key={index}>
                        {part}
                        {highlight && <mark>{highlight}</mark>}
                    </span>
                )
            })}
        </>
    )
}
