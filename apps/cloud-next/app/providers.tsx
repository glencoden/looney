'use client'

import { TRPCQueryClientProvider } from '@repo/api/client'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
    return <TRPCQueryClientProvider>{children}</TRPCQueryClientProvider>
}
