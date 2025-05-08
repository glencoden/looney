import {
    Form,
    Link,
    useFetcher,
    useLoaderData,
    useNavigation,
    useSubmit,
} from '@remix-run/react'
import { SetlistToSongInsertSchema, SetlistToSongSchema } from '@repo/db'
import {
    addSongToSetlist,
    getSetlist,
    getSongs,
    getSongsBySetlistId,
    removeSongFromSetlist,
} from '@repo/db/queries'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import Spinner from '@repo/ui/components/Spinner'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { toNonBreaking } from '@repo/utils/text'
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@vercel/remix'
import { AudioLines, Circle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { z } from 'zod'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const setlistId = z.string().parse(params.setlistId)

    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    const setlist = await getSetlist(setlistId)

    if (!setlist) {
        throw new Response('Not Found', { status: 404 })
    }

    const songs = await getSongs(q, false, true)
    const selectedSongs = await getSongsBySetlistId(setlistId)

    return json({ setlist, songs, selectedSongs, q })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData)

    if (formValues.selected !== 'true') {
        await removeSongFromSetlist(
            SetlistToSongSchema.parse({
                setlistId: formValues.setlistId,
                songId: formValues.songId,
            }),
        )
        return null
    }

    await addSongToSetlist(
        SetlistToSongInsertSchema.parse({
            setlistId: formValues.setlistId,
            songId: formValues.songId,
        }),
    )

    return null
}

export default function SetlistEdit() {
    const { setlist, songs, selectedSongs, q } = useLoaderData<typeof loader>()

    const navigation = useNavigation()
    const fetcher = useFetcher()

    const submit = useSubmit()

    const isLoading =
        navigation.location?.pathname === '/songs' &&
        navigation.state !== 'idle'

    const isSearching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has('q')

    useEffect(() => {
        const searchField = document.getElementById('song-search')
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q ?? ''
        }
    }, [q])

    const searchTimeoutIdRef = useRef<ReturnType<typeof setTimeout>>()

    return (
        <div
            className={cn('flex-grow max-lg:w-full', {
                'animate-pulse': isLoading,
            })}
        >
            <Subtitle2 className='float-end flex items-center gap-1'>
                {selectedSongs.length}
                <AudioLines className='h-4 w-4' />
            </Subtitle2>

            <H3 className='min-h-9 px-10'>
                Edit&nbsp;{toNonBreaking(setlist.title)}
            </H3>

            <section className='mt-8 flex gap-3'>
                <Button asChild disabled={isLoading}>
                    <Link to={`/setlists/${setlist.id}`}>Done</Link>
                </Button>

                <Form
                    className='relative w-full flex-grow'
                    method='get'
                    onChange={(event) => {
                        if (searchTimeoutIdRef.current) {
                            clearTimeout(searchTimeoutIdRef.current)
                        }

                        const isFirstSearch = q === null
                        const currentTarget = event.currentTarget

                        searchTimeoutIdRef.current = setTimeout(() => {
                            submit(currentTarget, {
                                replace: !isFirstSearch,
                            })
                        }, 500)
                    }}
                >
                    <Input
                        id='song-search'
                        aria-label='Song search input'
                        defaultValue={q || ''}
                        name='q'
                        placeholder='Search'
                        type='search'
                    />
                    {isSearching && (
                        <Spinner className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' />
                    )}
                </Form>
            </section>

            <ul className='mt-8 space-y-2'>
                {songs.map(({ id, artist, title }) => {
                    const isSelected = selectedSongs.find(
                        (song) => song.id === id,
                    )

                    return (
                        <li key={id}>
                            <div className='flex gap-3'>
                                <fetcher.Form method='post'>
                                    <input
                                        type='hidden'
                                        name='setlistId'
                                        value={setlist.id}
                                    />
                                    <input
                                        type='hidden'
                                        name='songId'
                                        value={id}
                                    />
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='mt-[1px]'
                                        aria-label={
                                            isSelected
                                                ? 'Remove from setlist'
                                                : 'Add to setlist'
                                        }
                                        name='selected'
                                        value={isSelected ? 'false' : 'true'}
                                        type={
                                            fetcher.state !== 'idle'
                                                ? 'button'
                                                : 'submit'
                                        }
                                    >
                                        <div className='relative h-4 w-4'>
                                            {fetcher.state !== 'idle' &&
                                            fetcher.formData?.get('songId') ===
                                                id ? (
                                                <Spinner
                                                    light
                                                    className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                                                />
                                            ) : (
                                                <Circle
                                                    className={cn(
                                                        'h-4 w-4 text-blue-700',
                                                        {
                                                            'fill-white text-white':
                                                                isSelected,
                                                        },
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </Button>
                                </fetcher.Form>

                                <div
                                    className={cn({
                                        'text-blue-300': !isSelected,
                                    })}
                                >
                                    <Body2
                                        className={cn('inline', {
                                            'text-blue-300': !isSelected,
                                        })}
                                    >
                                        <SearchHighlight
                                            text={toNonBreaking(artist)}
                                            searchString={q}
                                        />
                                    </Body2>
                                    &nbsp;&bull;&#32;
                                    <Body1
                                        className={cn('inline', {
                                            'text-blue-300': !isSelected,
                                        })}
                                    >
                                        <SearchHighlight
                                            text={toNonBreaking(title)}
                                            searchString={q}
                                        />
                                    </Body1>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
