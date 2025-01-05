import fs from 'fs'
import path from 'path'

const extractedPath = path.resolve('app', 'translations', 'extracted-messages')

const defaultLanguage = 'en'
const targetLanguages = ['de']

const originalMessages = JSON.parse(
    fs.readFileSync(
        path.join(extractedPath, `${defaultLanguage}.json`),
        'utf-8',
    ),
)

for (let i = 0; i < targetLanguages.length; i++) {
    const targetLanguage = targetLanguages[i]

    const existingMessagesPath = path.join(
        extractedPath,
        `${targetLanguage}.json`,
    )

    if (!fs.existsSync(existingMessagesPath)) {
        // If there is no file for a target language yet, create it manually
        continue
    }

    const existingMessages = JSON.parse(
        fs.readFileSync(existingMessagesPath, 'utf-8'),
    )

    const result = {}

    Object.keys(originalMessages).forEach((key) => {
        const matchByKey = existingMessages[key]

        if (matchByKey) {
            result[key] = {
                ...originalMessages[key],
                original: matchByKey.original,
                defaultMessage: matchByKey.defaultMessage,
            }
            return
        }

        result[key] = {
            original: originalMessages[key].defaultMessage,
            defaultMessage: '',
        }
    })

    fs.writeFileSync(existingMessagesPath, JSON.stringify(result, null, 4))
}
