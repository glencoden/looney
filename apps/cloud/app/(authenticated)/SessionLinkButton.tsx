'use client'

import { api } from '@repo/api/client'
import Button from '@repo/ui/components/Button'
import Link from 'next/link'

export function SessionLinkButton() {
    const { data: session, isPending } = api.session.getCurrent.useQuery()

    const href = isPending
        ? '/'
        : session
          ? `/session/${session.id}`
          : '/session'

    return (
        <Button asChild>
            <Link href={href}>Session</Link>
        </Button>
    )
}
