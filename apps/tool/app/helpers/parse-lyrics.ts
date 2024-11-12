import { Line } from '~/classes/Line'
import { Syllable } from '~/classes/Syllable'
import { Word } from '~/classes/Word'

export const parseLyrics = (lyrics: string | undefined): Line[] => {
    const result: Line[] = []

    if (!lyrics) {
        return result
    }

    const noReturns = lyrics.replace(/\r/g, '\n')
    const noMultiNewLines = noReturns.replace(/\n\s*\n/g, '\n')

    const lines = noMultiNewLines.split('\n')

    for (const line of lines) {
        const lineInstance = new Line()
        const words = line.split(' ')

        for (const word of words) {
            const wordInstance = new Word()
            const syllables = word.split('-')

            for (const syllable of syllables) {
                const syllableInstance = new Syllable(syllable)
                wordInstance.addSyllable(syllableInstance)
            }

            lineInstance.addWord(wordInstance)
        }

        result.push(lineInstance)
    }

    return result
}
