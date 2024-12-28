import { z } from 'zod'
import { findSyllables } from '../../../lib/openai.js'
import { protectedProcedure } from '../../index.js'

export const openaiRouter = {
    findSyllables: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            const response = await findSyllables(input)
            const result = response.choices[0]?.message.content

            if (!result) {
                throw new Error('Failed to find syllables.')
            }

            return result
                .split('\n')
                .map((line) => line.trim())
                .join('\n')
        }),
}
