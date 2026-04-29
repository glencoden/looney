'use client'

import BoxHorizontalPagination from '@repo/ui/components/BoxHorizontalPagination'
import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H2 from '@repo/ui/typography/H2'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type Setlist = {
    id: string
    title: string
    updatedAt: Date | string | null
}

export function SetlistsSidebar({
    setlists,
    children,
}: {
    setlists: Setlist[]
    children: ReactNode
}) {
    const pathname = usePathname()

    return (
        <BoxHorizontalPagination isLeft={pathname === '/setlists'}>
            <section className='max-w-96 flex-grow max-lg:w-full'>
                <Button asChild className='float-start' variant='ghost' size='icon'>
                    <Link href='/'>
                        <ArrowLeft className='h-6 w-6 text-white' />
                    </Link>
                </Button>

                <H2>Setlists</H2>

                <Button asChild className='mt-8'>
                    <Link href='/setlists/create'>New</Link>
                </Button>

                <ul className='mt-8 space-y-2'>
                    {setlists.map(({ id, title, updatedAt }) => {
                        const href = `/setlists/${id}`
                        const isActive =
                            pathname === href || pathname.startsWith(`${href}/`)
                        return (
                            <li key={id}>
                                <Link
                                    href={href}
                                    className={cn(
                                        'flex justify-between hover:underline',
                                        { underline: isActive },
                                    )}
                                >
                                    <Body2>{title}</Body2>
                                    {updatedAt && (
                                        <Body1>
                                            &nbsp;
                                            {format(
                                                new Date(updatedAt),
                                                'MMM d, yyyy',
                                            )}
                                        </Body1>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </section>

            {children}
        </BoxHorizontalPagination>
    )
}
