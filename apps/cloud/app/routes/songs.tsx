import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import {
    Form,
    Link,
    NavLink,
    Outlet,
    useFetcher,
    useLoaderData,
    useNavigate,
    useNavigation,
    useSubmit,
} from '@remix-run/react'
import { SongSchema } from '@repo/db'
import { getSongs, updateSong } from '@repo/db/queries'
import Button from '@repo/ui/Button'
import { cn } from '@repo/ui/helpers'
import Spinner from '@repo/ui/Spinner'
import { useEffect, useRef } from 'react'

function SearchHighlight({
    text,
    searchString,
}: Readonly<{
    text: string
    searchString: string | null
}>) {
    if (!searchString) {
        return <>{text}</>
    }

    const regex = new RegExp(searchString, 'gi')

    const highlights = text.match(regex) || []
    const parts = text.split(regex)

    return (
        <>
            {parts.map((part, index) => {
                const highlight = highlights[index]

                return (
                    <span key={index}>
                        {part}
                        {highlight && <mark>{highlight}</mark>}
                    </span>
                )
            })}
        </>
    )
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    const songs = await getSongs()

    return json({ songs, q })
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const formValues = Object.fromEntries(formData)
    const songUpdate = SongSchema.pick({
        id: true,
        isFavorite: true,
    }).parse({
        id: formValues.id,
        isFavorite: formValues.favorite === 'true',
    })

    await updateSong(songUpdate)

    return null
}

export default function Songs() {
    const { songs, q } = useLoaderData<typeof loader>()

    const navigate = useNavigate()
    const navigation = useNavigation()
    const submit = useSubmit()
    const fetcher = useFetcher()

    const isLoading =
        navigation.location?.pathname === '/songs' &&
        navigation.state !== 'idle'

    const isSearching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has('q')

    useEffect(() => {
        const searchField = document.getElementById('song-search')
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || ''
        }
    }, [q])

    const searchTimeoutIdRef = useRef<ReturnType<typeof setTimeout>>()

    return (
        <div
            className={cn(
                'px-main py-main container flex min-h-dvh border-2 border-amber-500',
                {
                    'animate-pulse': isLoading && !isSearching,
                },
            )}
        >
            <section className='space-y-4'>
                <Button asChild type='button'>
                    <Link to='/'>Back</Link>
                </Button>

                <h1>Songs</h1>

                <Form
                    method='get'
                    onChange={(event) => {
                        if (searchTimeoutIdRef.current) {
                            clearTimeout(searchTimeoutIdRef.current)
                        }
                        const isEmptySearch = event.currentTarget.q.value === ''

                        if (isEmptySearch) {
                            event.currentTarget.q.blur()
                            navigate('/songs')
                            return
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
                    {isSearching && <Spinner />}
                    <input
                        id='song-search'
                        aria-label='Song search input'
                        defaultValue={q || ''}
                        name='q'
                        placeholder='Search'
                        type='search'
                    />
                </Form>

                <Button asChild>
                    <Link to='/songs/create'>New</Link>
                </Button>

                <ul>
                    {songs.map(({ id, artist, title, isFavorite }) => (
                        <li key={id} className='flex items-center gap-2'>
                            <fetcher.Form method='post'>
                                <input type='hidden' name='id' value={id} />
                                <Button
                                    variant='ghost'
                                    aria-label={
                                        isFavorite
                                            ? 'Remove from favorites'
                                            : 'Add to favorites'
                                    }
                                    name='favorite'
                                    value={isFavorite ? 'false' : 'true'}
                                    type={
                                        fetcher.state !== 'idle'
                                            ? 'button'
                                            : 'submit'
                                    }
                                >
                                    <div
                                        className={cn(
                                            'h-4 w-4 rounded border-2 border-blue-800',
                                            {
                                                'bg-blue-500': (() => {
                                                    if (
                                                        fetcher.state !==
                                                            'idle' &&
                                                        fetcher.formData?.get(
                                                            'id',
                                                        ) === id
                                                    ) {
                                                        return (
                                                            fetcher.formData?.get(
                                                                'favorite',
                                                            ) === 'true'
                                                        )
                                                    }
                                                    return isFavorite
                                                })(),
                                            },
                                        )}
                                    />
                                </Button>
                            </fetcher.Form>

                            <NavLink
                                to={`/songs/${id}`}
                                className={({ isActive, isPending }) =>
                                    cn({
                                        'font-bold': isActive,
                                        'text-gray-500': isPending,
                                    })
                                }
                            >
                                <SearchHighlight
                                    text={`${artist} - ${title}`}
                                    searchString={q}
                                />
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </section>

            <Outlet />
        </div>
    )
}
