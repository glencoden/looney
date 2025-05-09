import {
    Form,
    Link,
    redirect,
    useLoaderData,
    useNavigation,
} from '@remix-run/react'
import { SetlistInsertSchema } from '@repo/db'
import {
    copySongsToSetlist,
    createSetlist,
    getSetlists,
} from '@repo/db/queries'
import BoxFullHeightSlot from '@repo/ui/components/BoxFullHeightSlot'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import Select from '@repo/ui/components/Select'
import { cn } from '@repo/ui/helpers'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { ActionFunctionArgs, json } from '@vercel/remix'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

export const loader = async () => {
    const setlists = await getSetlists()

    return json({ setlists })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData)

    const id = await createSetlist(
        SetlistInsertSchema.parse({ title: formValues.title }),
    )

    if (id === null) {
        throw new Response('Failed to create setlist', { status: 500 })
    }

    if (formValues.fromSetlistId) {
        await copySongsToSetlist(z.string().parse(formValues.fromSetlistId), id)
    }

    return redirect(`/setlists/${id}`)
}

export default function SetlistsCreate() {
    const { setlists } = useLoaderData<typeof loader>()

    const [selectedSetlistId, setSelectedSetlistId] = useState<string>()

    const navigation = useNavigation()
    const isLoading = navigation.state !== 'idle'

    return (
        <BoxFullHeightSlot>
            <div
                className={cn('flex-grow', {
                    'animate-pulse': isLoading,
                })}
            >
                <Button
                    asChild
                    className='float-start lg:hidden'
                    variant='ghost'
                    size='icon'
                    disabled={isLoading}
                >
                    <Link to='/setlists'>
                        <ArrowLeft className='h-6 w-6 text-white' />
                    </Link>
                </Button>

                <H3 className='h-9'>New Setlist</H3>

                <Form method='post' className='mt-7 flex flex-col gap-3'>
                    <section>
                        <Subtitle2>Title</Subtitle2>
                        <Input
                            type='text'
                            name='title'
                            aria-label='Setlist title'
                            placeholder='Title'
                            disabled={isLoading}
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

                    <Button type={isLoading ? 'button' : 'submit'}>
                        Create
                    </Button>
                </Form>
            </div>
        </BoxFullHeightSlot>
    )
}
