import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { type ReactNode, useState } from 'react'
import { AppRouter } from '../router'

export const API_PORT = 5555 // TODO: from where in the mono repo should this be exported?

const getBaseUrl = () => {
    return `http://localhost:${API_PORT}`
}

export const api = createTRPCReact<AppRouter>()

export function TRPCQueryClientProvider({
    children,
}: Readonly<{ children: ReactNode }>) {
    const [queryClient] = useState(() => new QueryClient())

    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' &&
                            opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/trpc`,
                    fetch(url, options) {
                        return fetch(url, {
                            ...options,
                            credentials: 'include',
                        });
                    },
                }),
            ],
        }),
    )

    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider client={trpcClient} queryClient={queryClient}>
                {children}
            </api.Provider>
        </QueryClientProvider>
    )
}