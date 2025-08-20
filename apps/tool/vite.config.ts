import { reactRouter } from '@react-router/dev/vite'
import { vercelPreset } from '@vercel/react-router/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    server: {
        port: 3003,
    },
    plugins: [
        reactRouter({
            presets: [vercelPreset()],
        }),
        tsconfigPaths(),
    ],
})
