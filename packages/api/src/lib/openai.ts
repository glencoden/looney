import OpenAI from 'openai'

let _openai: OpenAI | null = null
const getOpenai = () =>
    (_openai ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }))

export const findSyllables = async (content: string) => {
    return getOpenai().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `In the input text, separate all syllables of words with more than one syllable, using hyphens. Don't change any other characters. Example: The input text "I like reading" should output as "I like rea-ding".`,
            },
            {
                role: 'user',
                content,
            },
        ],
    })
}
