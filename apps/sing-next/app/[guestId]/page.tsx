import { getGuest, getSession, getSongsBySetlistId } from '@repo/db/queries'
import SearchHighlight from '@repo/ui/components/SearchHighlight'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H2 from '@repo/ui/typography/H2'
import H4 from '@repo/ui/typography/H4'
import { Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SearchInput } from './_components/SearchInput'

export default async function GuestPage({
    params,
    searchParams,
}: {
    params: Promise<{ guestId: string }>
    searchParams: Promise<{ q?: string }>
}) {
    const { guestId } = await params
    const { q = '' } = await searchParams

    const guest = await getGuest(guestId)
    if (!guest) notFound()

    const session = guest.sessionId ? await getSession(guest.sessionId) : null
    if (!session) notFound()

    const allSongs = await getSongsBySetlistId(session.setlistId)
    const t = await getTranslations()

    const needle = q.toLowerCase()
    const filteredSongs = needle
        ? allSongs.filter(
              (song) =>
                  song.artist.toLowerCase().includes(needle) ||
                  song.title.toLowerCase().includes(needle),
          )
        : allSongs

    return (
        <section className='mobile-sim-height overflow-y-auto px-6 py-12'>
            <SearchInput />

            <H2 className='mt-6'>{t('home.heading')}</H2>

            <ul className='mt-8 space-y-2 pb-48'>
                {filteredSongs.map(({ id, artist, title, genre, isFavorite }, index) => (
                    <li key={id}>
                        {filteredSongs[index - 1]?.genre !== genre && (
                            <H4 className='mb-2 mt-6 text-blue-800'>
                                {genre ?? 'Unknown'}
                            </H4>
                        )}
                        <Link
                            href={`/create/${guest.id}/${id}`}
                            className='flex items-center gap-3'
                        >
                            <Star
                                className={cn('h-4 w-4 text-pink-500', {
                                    'fill-white text-white': isFavorite,
                                })}
                            />
                            <div>
                                <Body2 className='inline whitespace-nowrap'>
                                    <SearchHighlight text={artist} searchString={q} />
                                </Body2>
                                &nbsp;&bull;{' '}
                                <Body1 className='inline whitespace-nowrap'>
                                    <SearchHighlight text={title} searchString={q} />
                                </Body1>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
