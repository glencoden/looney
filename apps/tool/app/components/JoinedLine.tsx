import { cn } from '@repo/ui/helpers'
import { Line } from '~/classes/Line'
import { Index } from '~/types/Index'

export default function JoinedLine({
    line,
    index,
    className,
}: Readonly<{
    line: Line | null
    index?: Index
    className?: string
}>) {
    let highlight = ''
    let regular = ''

    if (line) {
        if (!index) {
            regular = line.words
                .map((word) =>
                    word.syllables.map((syllable) => syllable.letters).join(''),
                )
                .join(' ')
        } else {
            line.words.forEach((word, wIndex) => {
                if (wIndex === index.word) {
                    word.syllables.forEach((syllable, sIndex) => {
                        let letters = syllable.letters

                        if (sIndex === word.syllables.length - 1) {
                            letters += ' '
                        }

                        if (sIndex > index.syllable) {
                            regular += letters
                            return
                        }
                        highlight += letters
                    })
                    return
                }

                let joined = word.syllables
                    .map((syllable) => syllable.letters)
                    .join('')

                if (wIndex < line.words.length - 1) {
                    joined += ' '
                }

                if (wIndex > index.word) {
                    regular += joined
                    return
                }

                highlight += joined
            })
        }
    }

    return (
        <p
            className={cn(
                'h-[180px] text-center leading-tight text-white',
                className,
            )}
        >
            {highlight.length > 0 && (
                <span className='text-red-400'>{highlight}</span>
            )}
            {regular.length > 0 && <span>{regular}</span>}
        </p>
    )
}
