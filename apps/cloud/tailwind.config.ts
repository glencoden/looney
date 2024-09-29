import type { Config } from 'tailwindcss'
import baseConfig from '@repo/tailwind-config/base'

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    presets: [baseConfig],
} satisfies Config
