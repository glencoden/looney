import js from '@eslint/js'
import prettier from 'eslint-config-prettier/flat'
import turbo from 'eslint-config-turbo/flat'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    {
        ignores: [
            '**/node_modules/**',
            '**/build/**',
            '**/dist/**',
            '**/.vercel/**',
        ],
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
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ...reactPlugin.configs.flat.recommended,
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ...reactPlugin.configs.flat['jsx-runtime'],
    },
    reactHooks.configs['recommended-latest'],
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ...jsxA11y.flatConfigs.recommended,
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        settings: {
            react: { version: 'detect' },
            formComponents: ['Form'],
            linkComponents: [
                { name: 'Link', linkAttribute: 'to' },
                { name: 'NavLink', linkAttribute: 'to' },
            ],
        },
    },
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx}'],
    })),
    {
        files: ['**/*.{ts,tsx}'],
        ...importPlugin.flatConfigs.recommended,
    },
    {
        files: ['**/*.{ts,tsx}'],
        ...importPlugin.flatConfigs.typescript,
        settings: {
            ...importPlugin.flatConfigs.typescript.settings,
            'import/internal-regex': '^~/',
            'import/resolver': {
                node: { extensions: ['.ts', '.tsx'] },
                typescript: { alwaysTryTypes: true },
            },
        },
    },
    prettier,
]
