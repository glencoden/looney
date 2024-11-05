import type { Config } from 'tailwindcss'
import baseConfig from '@repo/tailwind-config/base'
import plugin from 'tailwindcss/plugin'

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    presets: [baseConfig],
    theme: {
        extend: {
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
