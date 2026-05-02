'use client'

import { TRPCQueryClientProvider } from '@repo/api/client'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactNode } from 'react'

export function Providers({
    locale,
    messages,
    children,
}: {
    locale: string
    messages: Record<string, string>
    children: ReactNode
}) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <TRPCQueryClientProvider>{children}</TRPCQueryClientProvider>
        </NextIntlClientProvider>
    )
}
