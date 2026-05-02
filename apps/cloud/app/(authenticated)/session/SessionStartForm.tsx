'use client'

import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import Select from '@repo/ui/components/Select'
import { cn } from '@repo/ui/helpers'
import H2 from '@repo/ui/typography/H2'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { createSessionAction } from './actions'

type Setlist = { id: string; title: string }

export function SessionStartForm({ setlists }: { setlists: Setlist[] }) {
    const [selectedSetlistId, setSelectedSetlistId] = useState<string>('')
    const [isPending, startTransition] = useTransition()

    return (
        <BoxMain
            className={cn('flex flex-col items-center', {
                'animate-pulse': isPending,
            })}
        >
            <header className='w-full'>
                <Button
                    asChild
                    className='float-start'
                    variant='ghost'
                    size='icon'
                >
                    <Link href='/'>
                        <ArrowLeft className='h-6 w-6 text-white' />
                    </Link>
                </Button>

                <H2>Start a Session</H2>
            </header>

            <BoxContentSlot>
                <form
                    action={(formData) =>
                        startTransition(() => createSessionAction(formData))
                    }
                    className='flex w-full max-w-96 flex-col items-stretch gap-3'
                >
                    <Input
                        type='hidden'
                        name='timezoneOffset'
                        defaultValue={new Date().getTimezoneOffset()}
                    />

                    <section>
                        <Subtitle2>Title</Subtitle2>
                        <Input
                            type='text'
                            name='title'
                            aria-label='Session title'
                            placeholder='Title'
                            disabled={isPending}
                        />
                    </section>

                    <section>
                        <Subtitle2>Setlist</Subtitle2>
                        <Select
                            name='setlistId'
                            value={selectedSetlistId}
                            onChange={(e) =>
                                setSelectedSetlistId(e.target.value)
                            }
                        >
                            <option value=''>-</option>
                            {setlists.map((setlist) => (
                                <option key={setlist.id} value={setlist.id}>
                                    {setlist.title}
                                </option>
                            ))}
                        </Select>
                    </section>

                    <section>
                        <Subtitle2>Start Time</Subtitle2>
                        <Input
                            type='datetime-local'
                            name='startsAt'
                            aria-label='Start time'
                            placeholder='Start time'
                            className='min-w-0 appearance-none'
                            defaultValue={new Date()
                                .toLocaleString('sv-SE', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })
                                .replace(' ', 'T')}
                            disabled={isPending}
                        />
                    </section>

                    <hr className='w-full border-2 border-transparent' />

                    <Button type='submit' disabled={isPending}>
                        Start
                    </Button>
                </form>
            </BoxContentSlot>
        </BoxMain>
    )
}
