import type { Config } from 'tailwindcss'
import baseConfig from '@repo/tailwind-config/base'

export default {
    content: ['./src/**/*.tsx'],
    presets: [baseConfig],
} satisfies Config
