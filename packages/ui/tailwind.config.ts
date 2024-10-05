import type { Config } from 'tailwindcss'
import baseConfig from '@repo/tailwind-config/base'

export default {
    content: ['./src/**/*.tsx'],
    presets: [baseConfig],
    theme: {
        extend: {
            keyframes: {
                spinner: {
                    '0%': {
                        opacity: '1',
                    },
                    to: {
                        opacity: '0.25',
                    },
                },
            },
            animation: {
                spinner1: '0.8s infinite spinner linear -0.7s',
                spinner2: '0.8s infinite spinner linear -0.6s',
                spinner3: '0.8s infinite spinner linear -0.5s',
                spinner4: '0.8s infinite spinner linear -0.4s',
                spinner5: '0.8s infinite spinner linear -0.3s',
                spinner6: '0.8s infinite spinner linear -0.2s',
                spinner7: '0.8s infinite spinner linear -0.1s',
                spinner8: '0.8s infinite spinner linear',
            },
        },
    },
} satisfies Config
