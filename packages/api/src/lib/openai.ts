import OpenAI from 'openai'

let _openai: OpenAI | null = null
const getOpenai = () =>
    (_openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }))

export const findSyllables = async (content: string) => {
    return getOpenai().chat.completions.create({
        model: 'gpt-5.2',
        messages: [
            {
                role: 'system',
                content: `Insert a hyphen between syllables of every word that has more than one syllable. Preserve every other character exactly as given: capitalization, punctuation, whitespace, and line breaks. Output only the transformed text — no commentary, no quoting, no extra formatting.

Examples:
Input: I like singing along.
Output: I like sing-ing a-long.

Input: Hello, world!
Output: Hel-lo, world!`,
            },
            {
                role: 'user',
                content,
            },
        ],
    })
}
