import type { Config } from 'tailwindcss'

export default {
    theme: {
        container: {
            screens: {
                xl: '1280px',
            },
            center: true,
        },
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
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
                display: ['"Pacifico"', 'cursive'],
            },
        },
    },
} satisfies Omit<Config, 'content'>
