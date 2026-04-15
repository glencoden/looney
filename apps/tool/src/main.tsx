import { TRPCQueryClientProvider } from '@repo/api/client'
import '@repo/ui/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/fonts.css'
import './styles/tailwind.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw new Error('Root element not found')
}

createRoot(rootElement).render(
    <StrictMode>
        <TRPCQueryClientProvider>
            <App />
        </TRPCQueryClientProvider>
    </StrictMode>,
)
