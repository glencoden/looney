'use client'

import { api } from '@repo/api/client'
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
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { type ReactNode, useTransition } from 'react'
import { useDebouncedSearchNav } from '~/hooks/useDebouncedSearchNav'
import { toggleFavoriteAction } from './actions'

export default function SongsLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isMutating, startMutating] = useTransition()

    const q = searchParams.get('q')

    const utils = api.useUtils()
    const { data: songs = [], isFetching } = api.song.getAll.useQuery(
        q ? { q } : undefined,
    )

    const isOnIndex = pathname === '/songs'
    const isSearching = isFetching && q !== null

    const search = useDebouncedSearchNav({
        initialValue: q,
        buildUrl: (value) =>
            value ? `/songs?q=${encodeURIComponent(value)}` : '/songs',
    })

    return (
        <BoxMain
            className={cn({
                'animate-pulse': isMutating && !isSearching,
            })}
        >
            <BoxHorizontalPagination isLeft={isOnIndex}>
                <section className='max-w-96 flex-grow max-lg:w-full'>
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

                    <H2>Songs</H2>

                    <Button asChild className='mt-8'>
                        <Link href='/songs/create'>New</Link>
                    </Button>

                    <div className='relative mt-4'>
                        <Input
                            id='song-search'
                            type='search'
                            name='q'
                            aria-label='Song search input'
                            placeholder='Search'
                            defaultValue={q || ''}
                            onChange={search.onChange}
                        />
                        {isSearching && (
                            <Spinner className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' />
                        )}
                    </div>

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
                                        <form
                                            action={(fd) =>
                                                startMutating(async () => {
                                                    try {
                                                        await toggleFavoriteAction(
                                                            fd,
                                                        )
                                                    } finally {
                                                        await utils.song.getAll.invalidate()
                                                    }
                                                })
                                            }
                                        >
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
                                                type='submit'
                                            >
                                                <Star
                                                    className={cn(
                                                        'h-4 w-4 text-blue-700',
                                                        {
                                                            'fill-white text-white':
                                                                isFavorite,
                                                        },
                                                    )}
                                                />
                                            </Button>
                                        </form>

                                        <Link
                                            href={`/songs/${id}`}
                                            className={cn('hover:underline', {
                                                underline:
                                                    pathname ===
                                                        `/songs/${id}` ||
                                                    pathname.startsWith(
                                                        `/songs/${id}/`,
                                                    ),
                                            })}
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
                                        </Link>
                                    </div>
                                </li>
                            ),
                        )}
                    </ul>
                </section>

                {children}
            </BoxHorizontalPagination>
        </BoxMain>
    )
}
