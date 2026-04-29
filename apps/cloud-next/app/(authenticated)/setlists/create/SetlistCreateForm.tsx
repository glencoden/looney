'use client'

import BoxFullHeightSlot from '@repo/ui/components/BoxFullHeightSlot'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import Select from '@repo/ui/components/Select'
import { cn } from '@repo/ui/helpers'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { createSetlistAction } from '../actions'

type Setlist = { id: string; title: string }

export function SetlistCreateForm({ setlists }: { setlists: Setlist[] }) {
    const [selectedSetlistId, setSelectedSetlistId] = useState<string>('')
    const [isPending, startTransition] = useTransition()

    return (
        <BoxFullHeightSlot>
            <div
                className={cn('flex-grow', {
                    'animate-pulse': isPending,
                })}
            >
                <Button
                    asChild
                    className='float-start lg:hidden'
                    variant='ghost'
                    size='icon'
                    disabled={isPending}
                >
                    <Link href='/setlists'>
                        <ArrowLeft className='h-6 w-6 text-white' />
                    </Link>
                </Button>

                <H3 className='h-9'>New Setlist</H3>

                <form
                    action={(formData) =>
                        startTransition(() => createSetlistAction(formData))
                    }
                    className='mt-7 flex flex-col gap-3'
                >
                    <section>
                        <Subtitle2>Title</Subtitle2>
                        <Input
                            type='text'
                            name='title'
                            aria-label='Setlist title'
                            placeholder='Title'
                            disabled={isPending}
                        />
                    </section>

                    <section>
                        <Subtitle2>Copy songs from</Subtitle2>
                        <Select
                            name='fromSetlistId'
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

                    <hr className='w-full border-2 border-transparent' />

                    <Subtitle2>You can add songs later</Subtitle2>

                    <Button type='submit' disabled={isPending}>
                        Create
                    </Button>
                </form>
            </div>
        </BoxFullHeightSlot>
    )
}
