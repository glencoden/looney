import js from '@eslint/js'
import prettier from 'eslint-config-prettier/flat'
import turbo from 'eslint-config-turbo/flat'
import onlyWarn from 'eslint-plugin-only-warn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    {
        ignores: ['**/node_modules/**', '**/dist/**'],
    },
    js.configs.recommended,
    ...turbo,
    {
        files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                React: true,
                JSX: true,
            },
        },
        plugins: {
            'only-warn': onlyWarn,
        },
    },
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx}'],
    })),
    prettier,
]
