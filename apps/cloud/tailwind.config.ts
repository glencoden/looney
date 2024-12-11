import type { Config } from 'tailwindcss'
import baseConfig from '../../packages/config-tailwind/base'

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    presets: [baseConfig],
} satisfies Config
