'use client'

import Button from '@repo/ui/components/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import { deleteSongAction } from '../actions'

export function SongBackButton() {
    return (
        <Button
            asChild
            className='float-start lg:hidden'
            variant='ghost'
            size='icon'
        >
            <Link href='/songs'>
                <ArrowLeft className='h-6 w-6 text-white' />
            </Link>
        </Button>
    )
}

export function SongActions({ songId }: { songId: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <section className='mt-8 grid grid-cols-2 gap-3'>
            <Button asChild disabled={isPending}>
                <Link href={`/songs/${songId}/edit`}>Edit</Link>
            </Button>

            <form
                action={() =>
                    startTransition(() => deleteSongAction(songId))
                }
                onSubmit={(event) => {
                    const ok = confirm(
                        'Please confirm you want to delete this song.',
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
