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
import { ActionFunctionArgs, json } from '@vercel/remix'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

const LIVE_SESSION_LENGTH = 1000 * 60 * 60 * 18

export const loader = async () => {
    const setlists = await getSetlists()

    return json({ setlists })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData)

    if (
        typeof formValues.title !== 'string' ||
        typeof formValues.setlistId !== 'string' ||
        typeof formValues.startsAt !== 'string'
    ) {
        return json({ error: 'Missing required fields' }, { status: 400 })
    }

    // We create a date using the datetime-local value as UTC, so that we can correct by the input client's timezone offset, rather than the server JS runtime's
    const rawStartDate = new Date(`${formValues.startsAt}Z`)

    const timezoneOffset = formValues.timezoneOffset
        ? Number(formValues.timezoneOffset)
        : 0

    const startDate = new Date(
        rawStartDate.getTime() + 1000 * 60 * timezoneOffset,
    )

    const id = await createSession(
        SessionInsertSchema.parse({
            title: formValues.title,
            setlistId: formValues.setlistId,
            startsAt: startDate,
            endsAt: new Date(startDate.getTime() + LIVE_SESSION_LENGTH),
        }),
    )

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
                <Form
                    method='post'
                    className='flex w-full max-w-96 flex-col items-stretch gap-3'
                    replace
                >
                    <Input
                        type='hidden'
                        name='timezoneOffset'
                        value={new Date().getTimezoneOffset()}
                    />

                    <section>
                        <Subtitle2>Title</Subtitle2>
                        <Input
                            type='text'
                            name='title'
                            aria-label='Session title'
                            placeholder='Title'
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
                            type='datetime-local'
                            name='startsAt'
                            aria-label='Start time'
                            placeholder='Start time'
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
            </BoxContentSlot>
        </BoxMain>
    )
}
