import path from 'node:path'
import nextPlugin from '@next/eslint-plugin-next'
import { includeIgnoreFile } from '@repo/config-eslint/gitignore.js'
import baseConfig from '@repo/config-eslint/react.js'
import reactCompiler from 'eslint-plugin-react-compiler'

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore')

export default [
    includeIgnoreFile(gitignorePath),
    {
        ignores: ['**/.next/**', 'next-env.d.ts'],
    },
    ...baseConfig,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: { 'react-compiler': reactCompiler },
        rules: { 'react-compiler/react-compiler': 'error' },
    },
    {
        files: ['**/*.{ts,tsx}'],
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
                },
                typescript: { alwaysTryTypes: true },
            },
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: { '@next/next': nextPlugin },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },
]
