import { z } from 'zod'
import { findSyllables } from '../../../lib/openai.js'
import { protectedProcedure } from '../../index.js'

const normalize = (text: string) =>
    text
        .split('\n')
        .map((line) => line.trim())
        .join('\n')

const stripHyphens = (text: string) => text.replace(/-/g, '')

export const openaiRouter = {
    findSyllables: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            const expected = stripHyphens(normalize(input))

            for (let attempt = 0; attempt < 2; attempt++) {
                const response = await findSyllables(input)
                const content = response.choices[0]?.message.content
                if (!content) {
                    throw new Error('Failed to find syllables.')
                }
                const result = normalize(content)
                if (stripHyphens(result) === expected) {
                    return result
                }
            }

            throw new Error(
                'Syllabification altered the text. Please try again.',
            )
        }),
}
