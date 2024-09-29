/** @type {import('eslint').Linter.Config} */
module.exports = {
    parserOptions: {
        project: ['./packages/*/tsconfig.json', './apps/*/tsconfig.json'],
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'prettier',
        'plugin:import/typescript',
    ],
    rules: {
        // Code
        curly: 'error',

        // Project structure
        'import/no-cycle': ['error'],

        // TypeScript
        '@typescript-eslint/no-unnecessary-type-assertion': 'off', // doesn't go well with no-unsafe-assignment
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
                fixStyle: 'inline-type-imports',
            },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksVoidReturn: { attributes: false },
            },
        ],
    },
    ignorePatterns: ['node_modules', 'scripts', 'dist', 'build'],
}
