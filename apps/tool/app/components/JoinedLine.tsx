import { cn } from '@repo/ui/helpers'
import { Line } from '~/classes/Line'
import { Index } from '~/types/Index'

export default function JoinedLine({
    line,
    index,
    className,
}: Readonly<{
    line: Line
    index?: Index
    className?: string
}>) {
    if (!index) {
        return (
            <p className={cn('text-center text-white', className)}>
                {line.words
                    .map((word) =>
                        word.syllables
                            .map((syllable) => syllable.letters)
                            .join(''),
                    )
                    .join(' ')}
            </p>
        )
    }

    let highlight = ''
    let rest = ''

    line.words.forEach((word, wIndex) => {
        if (wIndex === index.word) {
            word.syllables.forEach((syllable, sIndex) => {
                let letters = syllable.letters

                if (sIndex === word.syllables.length - 1) {
                    letters += ' '
                }

                if (sIndex > index.syllable) {
                    rest += letters
                    return
                }
                highlight += letters
            })
            return
        }

        let joined = word.syllables.map((syllable) => syllable.letters).join('')

        if (wIndex < line.words.length - 1) {
            joined += ' '
        }

        if (wIndex > index.word) {
            rest += joined
            return
        }

        highlight += joined
    })

    return (
        <p className={cn('text-center text-white', className)}>
            <span className='text-red-400'>{highlight}</span>
            <span>{rest}</span>
        </p>
    )
}
