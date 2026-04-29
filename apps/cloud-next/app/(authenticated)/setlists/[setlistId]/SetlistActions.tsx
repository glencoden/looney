'use client'

import Button from '@repo/ui/components/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import { deleteSetlistAction } from '../actions'

export function SetlistBackButton() {
    return (
        <Button
            asChild
            className='float-start lg:hidden'
            variant='ghost'
            size='icon'
        >
            <Link href='/setlists'>
                <ArrowLeft className='h-6 w-6 text-white' />
            </Link>
        </Button>
    )
}

export function SetlistActions({ setlistId }: { setlistId: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <section className='mt-8 grid grid-cols-2 gap-3'>
            <Button asChild disabled={isPending}>
                <Link href={`/setlists/${setlistId}/edit`}>Edit</Link>
            </Button>

            <form
                action={() =>
                    startTransition(() => deleteSetlistAction(setlistId))
                }
                onSubmit={(event) => {
                    const ok = confirm(
                        'Please confirm you want to delete this setlist.',
                    )
                    if (!ok) event.preventDefault()
                }}
            >
                <Button variant='secondary' type='submit' disabled={isPending}>
                    Delete
                </Button>
            </form>
        </section>
    )
}
