import baseConfig from '@repo/config-tailwind/base'
import type { Config } from 'tailwindcss'

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    presets: [baseConfig],
} satisfies Config
