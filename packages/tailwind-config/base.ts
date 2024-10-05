import type { Config } from 'tailwindcss'

export default {
    theme: {
        container: {
            center: true,
        },
        extend: {
            fontFamily: {
                sans: [
                    '"Poppins"',
                    'ui-sans-serif',
                    'system-ui',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"',
                ],
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
} satisfies Omit<Config, 'content'>
