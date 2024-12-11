import baseConfig from '@repo/config-tailwind/base'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    presets: [baseConfig],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Avant Garde Gothic EF', 'sans-serif'],
            },
            textShadow: {
                DEFAULT: '1px 2px 2px var(--tw-shadow-color)',
            },
        },
    },
    plugins: [
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme('textShadow') },
            )
        }),
    ],
} satisfies Config
