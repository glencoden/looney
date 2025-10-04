/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },
    ignorePatterns: ['dist', '.astro'],

    // Base config
    extends: ['eslint:recommended'],

    overrides: [
        // Astro files
        {
            files: ['**/*.astro'],
            parser: 'astro-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
                extraFileExtensions: ['.astro'],
            },
            extends: ['plugin:astro/recommended'],
            rules: {
                'astro/no-conflict-set-directives': 'error',
                'astro/no-unused-define-vars-in-style': 'error',
            },
        },

        // React
        {
            files: ['**/*.{js,jsx,ts,tsx}'],
            plugins: ['react', 'jsx-a11y'],
            extends: [
                'plugin:react/recommended',
                'plugin:react/jsx-runtime',
                'plugin:react-hooks/recommended',
                'plugin:jsx-a11y/recommended',
            ],
            settings: {
                react: {
                    version: 'detect',
                },
                'import/resolver': {
                    typescript: {},
                },
            },
        },

        // TypeScript
        {
            files: ['**/*.{ts,tsx}'],
            plugins: ['@typescript-eslint', 'import'],
            parser: '@typescript-eslint/parser',
            settings: {
                'import/resolver': {
                    node: {
                        extensions: ['.ts', '.tsx'],
                    },
                    typescript: {
                        alwaysTryTypes: true,
                    },
                },
            },
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:import/recommended',
                'plugin:import/typescript',
            ],
        },

        // Node
        {
            files: ['.eslintrc.cjs', 'astro.config.mjs'],
            env: {
                node: true,
            },
        },
    ],
}
