import {
    Form,
    Link,
    NavLink,
    Outlet,
    useFetcher,
    useLoaderData,
    useLocation,
    useNavigation,
    useSubmit,
    ActionFunctionArgs,
    LoaderFunctionArgs,
} from 'react-router'
import { SongSchema } from '@repo/db'
import { getSongs, updateSong } from '@repo/db/queries'
import BoxHorizontalPagination from '@repo/ui/components/BoxHorizontalPagination'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import Spinner from '@repo/ui/components/Spinner'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H2 from '@repo/ui/typography/H2'
import H4 from '@repo/ui/typography/H4'
import { toNonBreaking } from '@repo/utils/text'
import { ArrowLeft, Star } from 'lucide-react'
import { useEffect, useRef } from 'react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    const songs = await getSongs(q)

    return { songs, q }
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

    const location = useLocation()
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
        <BoxMain
            className={cn({
                'animate-pulse': isLoading && !isSearching,
            })}
        >
            <BoxHorizontalPagination isLeft={location.pathname === '/songs'}>
                <section className='max-w-96 flex-grow max-lg:w-full'>
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

                    <H2>Songs</H2>

                    <Button asChild className='mt-8'>
                        <Link to='/songs/create'>New</Link>
                    </Button>

                    <Form
                        className='relative mt-4'
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
                            type='search'
                            name='q'
                            aria-label='Song search input'
                            placeholder='Search'
                            defaultValue={q || ''}
                        />
                        {isSearching && (
                            <Spinner className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' />
                        )}
                    </Form>

                    <ul className='mt-8 space-y-2'>
                        {songs.map(
                            (
                                { id, artist, title, genre, isFavorite },
                                index,
                            ) => (
                                <li key={id}>
                                    {songs[index - 1]?.genre !== genre && (
                                        <H4 className='mb-2 mt-6 text-blue-300'>
                                            {genre ?? 'Unknown'}
                                        </H4>
                                    )}
                                    <div className='flex gap-3'>
                                        <fetcher.Form method='post'>
                                            <input
                                                type='hidden'
                                                name='id'
                                                value={id}
                                            />
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                className='mt-[1px]'
                                                aria-label={
                                                    isFavorite
                                                        ? 'Remove from favorites'
                                                        : 'Add to favorites'
                                                }
                                                name='favorite'
                                                value={
                                                    isFavorite
                                                        ? 'false'
                                                        : 'true'
                                                }
                                                type={
                                                    fetcher.state !== 'idle'
                                                        ? 'button'
                                                        : 'submit'
                                                }
                                            >
                                                <Star
                                                    className={cn(
                                                        'h-4 w-4 text-blue-700',
                                                        {
                                                            'fill-white text-white':
                                                                (() => {
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
                                                                            ) ===
                                                                            'true'
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
                                            className={({
                                                isActive,
                                                isPending,
                                            }) =>
                                                cn('hover:underline', {
                                                    underline: isActive,
                                                    'text-gray-500': isPending,
                                                })
                                            }
                                        >
                                            <Body2 className='inline'>
                                                <SearchHighlight
                                                    text={toNonBreaking(artist)}
                                                    searchString={q}
                                                />
                                            </Body2>
                                            &nbsp;&bull;&#32;
                                            <Body1 className='inline'>
                                                <SearchHighlight
                                                    text={toNonBreaking(title)}
                                                    searchString={q}
                                                />
                                            </Body1>
                                        </NavLink>
                                    </div>
                                </li>
                            ),
                        )}
                    </ul>
                </section>

                <Outlet />
            </BoxHorizontalPagination>
        </BoxMain>
    )
}
