import { ActionFunctionArgs, json } from '@remix-run/node'
import {
    Form,
    Link,
    redirect,
    useLoaderData,
    useNavigation,
} from '@remix-run/react'
import { SessionInsertSchema } from '@repo/db'
import { createSession, getSetlists } from '@repo/db/queries'
import BoxContentSlot from '@repo/ui/components/BoxContentSlot'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import Select from '@repo/ui/components/Select'
import { cn } from '@repo/ui/helpers'
import H2 from '@repo/ui/typography/H2'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

const DEMO_SESSION_LENGTH = 1000 * 60 * 60
const LIVE_SESSION_LENGTH = 1000 * 60 * 60 * 18

export const loader = async () => {
    const setlists = await getSetlists()

    return json({ setlists })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData)

    const startDate = formValues.startsAt
        ? new Date(z.string().parse(formValues.startsAt))
        : new Date()

    const payload =
        formValues.isDemo === 'true'
            ? {
                  title: 'Demo',
                  setlistId: formValues.setlistId,
                  isDemo: true,
                  startsAt: startDate,
                  endsAt: new Date(startDate.getTime() + DEMO_SESSION_LENGTH),
              }
            : {
                  title: formValues.title,
                  setlistId: formValues.setlistId,
                  startsAt: startDate,
                  endsAt: new Date(startDate.getTime() + LIVE_SESSION_LENGTH),
              }

    const id = await createSession(SessionInsertSchema.parse(payload))

    if (id === null) {
        throw new Response('Failed to create session', { status: 500 })
    }

    return redirect(`/session/${id}`, {
        status: 303,
        headers: {
            Location: `/session/${id}`,
        },
    })
}

export default function Session() {
    const { setlists } = useLoaderData<typeof loader>()

    const [selectedSetlistId, setSelectedSetlistId] = useState<string>()

    const navigation = useNavigation()
    const isLoading = navigation.state !== 'idle'

    return (
        <BoxMain
            className={cn('flex flex-col items-center', {
                'animate-pulse': isLoading,
            })}
        >
            <header className='w-full'>
                <Button
                    asChild
                    className='float-start'
                    variant='ghost'
                    size='icon'
                >
                    <Link to='/'>
                        <ArrowLeft className='h-6 w-6 text-white' />
                    </Link>
                </Button>

                <H2>Start a Session</H2>
            </header>

            <BoxContentSlot>
                <div className='max-w-96 gap-14'>
                    <Form
                        method='post'
                        className='flex w-full flex-col gap-3'
                        replace
                    >
                        <section>
                            <Subtitle2>Title</Subtitle2>
                            <Input
                                aria-label='Session title'
                                name='title'
                                placeholder='Title'
                                type='text'
                                disabled={isLoading}
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
                                aria-label='Start time'
                                name='startsAt'
                                placeholder='Start time'
                                type='datetime-local'
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
                                disabled={isLoading}
                            />
                        </section>

                        <hr className='w-full border-2 border-transparent' />

                        <Button type={isLoading ? 'button' : 'submit'}>
                            Start
                        </Button>
                    </Form>

                    <Form
                        method='post'
                        className='flex w-full flex-col gap-3'
                        replace
                    >
                        <Input
                            aria-label='Hidden demo flag'
                            name='isDemo'
                            value='true'
                            type='hidden'
                        />

                        <Input
                            aria-label='Hidden setlist id'
                            name='setlistId'
                            value={setlists[0]?.id ?? ''}
                            type='hidden'
                        />

                        <Subtitle2>Try out the Session in Demo Mode</Subtitle2>

                        <Button
                            variant='secondary'
                            type={isLoading ? 'button' : 'submit'}
                        >
                            Start Demo
                        </Button>
                    </Form>
                </div>
            </BoxContentSlot>
        </BoxMain>
    )
}
