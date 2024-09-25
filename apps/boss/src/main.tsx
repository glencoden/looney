import { TRPCQueryClientProvider } from '@repo/api/provider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TRPCQueryClientProvider>
            <App />
        </TRPCQueryClientProvider>
    </React.StrictMode>,
)
