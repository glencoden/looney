import config from '@repo/config-eslint/library.js'

export default [
    ...config,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.lint.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]
