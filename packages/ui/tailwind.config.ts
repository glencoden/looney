import baseConfig from '@repo/config-tailwind/base'
import type { Config } from 'tailwindcss'

export default {
    content: ['./src/**/*.tsx'],
    presets: [baseConfig],
    theme: {
        extend: {
            dropShadow: {
                DEFAULT: '4px 4px 0 #000',
            },
            keyframes: {
                spinner: {
                    '0%': {
                        opacity: '1',
                    },
                    to: {
                        opacity: '0.25',
                    },
                },
                'flicker-primary': {
                    '0%, 18%, 22%, 25%, 53%, 57%, 100%': {
                        textShadow:
                            '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #1E40AF, 0 0 80px #1E40AF, 0 0 90px #1E40AF, 0 0 100px #1E40AF, 0 0 150px #1E40AF',
                    },
                    '20%, 24%, 55%': {
                        textShadow: 'none',
                    },
                },
                'flicker-secondary': {
                    '0%, 18%, 22%, 25%, 53%, 57%, 100%': {
                        textShadow:
                            '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #DB2777, 0 0 80px #DB2777, 0 0 90px #DB2777, 0 0 100px #DB2777, 0 0 150px #DB2777',
                    },
                    '20%, 24%, 55%': {
                        textShadow: 'none',
                    },
                },
                'flicker-light': {
                    '0%, 18%, 22%, 25%, 53%, 57%, 100%': {
                        textShadow:
                            '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #FACC15, 0 0 80px #FACC15, 0 0 90px #FACC15, 0 0 100px #FACC15, 0 0 150px #FACC15',
                    },
                    '20%, 24%, 55%': {
                        textShadow: 'none',
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
                'flicker-primary': 'flicker-primary 1.5s infinite alternate',
                'flicker-secondary':
                    'flicker-secondary 1.5s infinite alternate',
                'flicker-light': 'flicker-light 1.5s infinite alternate',
            },
        },
    },
} satisfies Config
