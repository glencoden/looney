'use client'

import { TRPCQueryClientProvider } from '@repo/api/client'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import type { ReactNode } from 'react'

export function Providers({
    locale,
    messages,
    children,
}: {
    locale: string
    messages: AbstractIntlMessages
    children: ReactNode
}) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <TRPCQueryClientProvider>{children}</TRPCQueryClientProvider>
        </NextIntlClientProvider>
    )
}
