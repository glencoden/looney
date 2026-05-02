import 'server-only'
import { auth } from '~/lib/auth'
import { createContext, trpcRouter } from '@repo/api/server'
import { headers } from 'next/headers'
import { cache } from 'react'

export const getServerCaller = cache(async () => {
    const reqHeaders = await headers()
    const session = await auth.api.getSession({ headers: reqHeaders })

    const ctx = await createContext({
        req: new Request('http://internal', { headers: reqHeaders }),
        user: session?.user
            ? {
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.name,
                  image: session.user.image ?? null,
              }
            : null,
    })

    return trpcRouter.createCaller(ctx)
})
