'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { Drawer } from 'vaul'

export function DrawerShell({
    guestId,
    children,
}: {
    guestId: string
    children: ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.toString()
    const root = query ? `/${guestId}?${query}` : `/${guestId}`
    const open = pathname !== `/${guestId}`
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Drawer.Root
            open={open}
            modal={false}
            onOpenChange={(next) => {
                if (!next) router.push(root)
            }}
        >
            {open && (
                <button
                    type='button'
                    aria-label='Close drawer'
                    className='absolute inset-x-0 bottom-24 top-0 z-10'
                    onClick={() => router.push(root)}
                />
            )}
            <Drawer.Content className='absolute inset-x-0 bottom-20 z-10 box-content flex h-auto flex-col items-center gap-8 rounded-t-2xl border-l-4 border-r-4 border-t-4 border-black bg-blue-800 px-6 py-12 pb-4 shadow-[0_-6px_14px_rgba(0,0,0,0.25)] outline-0'>
                <Drawer.Title className='sr-only'>Drawer</Drawer.Title>
                <Drawer.Description className='sr-only'>
                    Drawer content
                </Drawer.Description>
                <div className='min-h-80 w-full'>{children}</div>
            </Drawer.Content>
        </Drawer.Root>
    )
}
