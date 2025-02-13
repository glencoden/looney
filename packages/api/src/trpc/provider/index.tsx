import type { SupabaseClient } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { type FC, type PropsWithChildren, useState } from 'react'
import superjson from 'superjson'
import { API_PORT } from '../../index.js'
import { api } from '../client/index.js'

export const TRPCQueryClientProvider: FC<
    PropsWithChildren<
        Readonly<{
            baseUrl?: string
            supabaseClient?: SupabaseClient
        }>
    >
> = ({ children, baseUrl, supabaseClient }) => {
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
                    url: `${baseUrl ?? `http://localhost:${API_PORT}`}/trpc`,
                    transformer: superjson,
                    headers: async () => {
                        let authHeaders: { Authorization?: string } = {}

                        if (!supabaseClient) {
                            return authHeaders
                        }

                        const { data, error } =
                            await supabaseClient.auth.getSession()

                        if (error !== null) {
                            throw new Error(error.message)
                        }

                        const accessToken = data.session?.access_token

                        if (accessToken) {
                            authHeaders = {
                                Authorization: `Bearer ${accessToken}`,
                            }
                        }

                        return authHeaders
                    },
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
