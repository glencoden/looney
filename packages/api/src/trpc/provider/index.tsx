import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { type FC, type PropsWithChildren, useState } from 'react'
import { API_PORT } from '../../index.js'
import { api } from '../client/index.js'

const getBaseUrl = () => {
    return `http://localhost:${API_PORT}`
}

export const TRPCQueryClientProvider: FC<PropsWithChildren> = ({
    children,
}) => {
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
                        })
                    },
                }),
            ],
        }),
    )

    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider
                client={trpcClient}
                queryClient={
                    queryClient as unknown as Parameters<
                        typeof api.Provider
                    >[0]['queryClient']
                }
            >
                {children}
            </api.Provider>
        </QueryClientProvider>
    )
}
