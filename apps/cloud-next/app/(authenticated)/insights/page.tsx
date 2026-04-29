import { getSongInsights } from '@repo/db/queries'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H3 from '@repo/ui/typography/H3'
import Small from '@repo/ui/typography/Small'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { toNonBreaking } from '@repo/utils/text'
import {
    AlignJustify,
    AlignLeft,
    ArrowDown,
    ArrowLeft,
    ArrowUp,
} from 'lucide-react'
import Link from 'next/link'

type SortBy = 'count' | 'calls' | 'ratio'
type SortOrder = 'asc' | 'desc'
type Layout = 'absolute' | 'relative'

const SORT_BY_VALUES: SortBy[] = ['count', 'calls', 'ratio']
const SORT_ORDER_VALUES: SortOrder[] = ['asc', 'desc']
const LAYOUT_VALUES: Layout[] = ['absolute', 'relative']

const parseEnum = <T extends string>(
    value: string | undefined,
    allowed: readonly T[],
    fallback: T,
): T => (allowed.includes(value as T) ? (value as T) : fallback)

const buildSearch = (params: Record<string, string | undefined>) => {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value) search.set(key, value)
    }
    const str = search.toString()
    return str ? `?${str}` : ''
}

export default async function InsightsPage({
    searchParams,
}: {
    searchParams: Promise<{
        startDate?: string
        endDate?: string
        sortBy?: string
        sortOrder?: string
        layout?: string
    }>
}) {
    const params = await searchParams
    const startDate = params.startDate ?? ''
    const endDate = params.endDate ?? ''
    const sortBy = parseEnum(params.sortBy, SORT_BY_VALUES, 'count')
    const sortOrder = parseEnum(params.sortOrder, SORT_ORDER_VALUES, 'desc')
    const layout = parseEnum(params.layout, LAYOUT_VALUES, 'absolute')
    const showRelative = layout === 'relative'

    const songInsights = await getSongInsights({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
    })

    const totalSessions = new Set(
        songInsights.flatMap(({ sessionIds }) => sessionIds),
    ).size
    const totalCount = songInsights.reduce((acc, { count }) => acc + count, 0)
    const totalCallsToStage = songInsights.reduce(
        (acc, { countStageCalls }) => acc + countStageCalls,
        0,
    )
    const maxCount = Math.max(...songInsights.map(({ count }) => count), 0)

    const sorted = songInsights.slice().sort((a, b) => {
        if (sortBy === 'calls') {
            return sortOrder === 'asc'
                ? a.countStageCalls - b.countStageCalls
                : b.countStageCalls - a.countStageCalls
        }
        if (sortBy === 'ratio') {
            const ratioA = a.count === 0 ? 0 : a.countStageCalls / a.count
            const ratioB = b.count === 0 ? 0 : b.countStageCalls / b.count
            return sortOrder === 'asc' ? ratioA - ratioB : ratioB - ratioA
        }
        return sortOrder === 'asc' ? a.count - b.count : b.count - a.count
    })

    const sortHref = (column: SortBy) => {
        const nextOrder: SortOrder =
            sortBy === column && sortOrder === 'desc' ? 'asc' : 'desc'
        return `/insights${buildSearch({
            startDate,
            endDate,
            sortBy: column,
            sortOrder: nextOrder,
            layout: showRelative ? 'relative' : undefined,
        })}`
    }

    const layoutHref = `/insights${buildSearch({
        startDate,
        endDate,
        sortBy: sortBy === 'count' ? undefined : sortBy,
        sortOrder: sortOrder === 'desc' ? undefined : sortOrder,
        layout: showRelative ? undefined : 'relative',
    })}`

    return (
        <BoxMain>
            <Button asChild className='float-start' variant='ghost' size='icon'>
                <Link href='/'>
                    <ArrowLeft className='h-6 w-6 text-white' />
                </Link>
            </Button>

            <H3 className='min-h-9 px-10'>Insights</H3>

            <section className='mt-10 flex justify-between'>
                <form method='get' className='space-y-2'>
                    <input type='hidden' name='sortBy' value={sortBy} />
                    <input type='hidden' name='sortOrder' value={sortOrder} />
                    <input type='hidden' name='layout' value={layout} />
                    <div className='flex flex-wrap gap-2'>
                        <div className='space-y-2'>
                            <Subtitle2>Start</Subtitle2>
                            <Input
                                type='date'
                                name='startDate'
                                aria-label='Start date'
                                placeholder='Start date'
                                defaultValue={startDate}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Subtitle2>End</Subtitle2>
                            <Input
                                type='date'
                                name='endDate'
                                aria-label='End date'
                                placeholder='End date'
                                defaultValue={endDate}
                            />
                        </div>
                    </div>
                    <div className='space-x-2 pt-2'>
                        <Button className='inline-flex' size='sm' type='submit'>
                            Apply
                        </Button>
                        <Button
                            asChild
                            className='inline-flex'
                            size='sm'
                            variant='secondary'
                        >
                            <Link href='/insights'>Clear</Link>
                        </Button>
                    </div>
                </form>

                <Button asChild variant='ghost' size='auto'>
                    <Link href={layoutHref}>
                        {showRelative ? <AlignJustify /> : <AlignLeft />}
                    </Link>
                </Button>
            </section>

            <ul className='mt-8 space-y-2'>
                <div className='flex flex-wrap items-center justify-between gap-2 py-2'>
                    <Subtitle2>
                        {totalSessions} Sessions &nbsp;&bull;&nbsp;
                        {songInsights.length} Songs
                    </Subtitle2>
                    <div className='flex w-full justify-between gap-2 sm:w-80 lg:w-96'>
                        <Button asChild variant='ghost' size='auto'>
                            <Link href={sortHref('calls')}>
                                {sortBy === 'calls' && sortOrder === 'asc' && (
                                    <ArrowDown className='h-4 w-4 shrink-0' />
                                )}
                                {sortBy === 'calls' && sortOrder === 'desc' && (
                                    <ArrowUp className='h-4 w-4 shrink-0' />
                                )}
                                Called &nbsp;
                                <Small className='text-blue-300'>
                                    ({totalCallsToStage})
                                </Small>
                            </Link>
                        </Button>
                        <Button asChild variant='ghost' size='auto'>
                            <Link href={sortHref('ratio')}>
                                {sortBy === 'ratio' && sortOrder === 'asc' && (
                                    <ArrowDown className='h-4 w-4 shrink-0' />
                                )}
                                {sortBy === 'ratio' && sortOrder === 'desc' && (
                                    <ArrowUp className='h-4 w-4 shrink-0' />
                                )}
                                Ratio
                            </Link>
                        </Button>
                        <Button asChild variant='ghost' size='auto'>
                            <Link href={sortHref('count')}>
                                {sortBy === 'count' && sortOrder === 'asc' && (
                                    <ArrowDown className='h-4 w-4 shrink-0' />
                                )}
                                {sortBy === 'count' && sortOrder === 'desc' && (
                                    <ArrowUp className='h-4 w-4 shrink-0' />
                                )}
                                Total &nbsp;
                                <Small className='text-blue-300'>
                                    ({totalCount})
                                </Small>
                            </Link>
                        </Button>
                    </div>
                </div>

                {sorted.map(
                    ({ id, artist, title, count, countStageCalls }, index) => (
                        <li
                            key={id}
                            className={cn(
                                'flex justify-between gap-4 rounded-sm px-1 max-sm:flex-col',
                                {
                                    'bg-blue-900/50': index % 2 === 0,
                                },
                            )}
                        >
                            <div>
                                <Body1 className='inline-block w-10 text-blue-300'>
                                    {index + 1}
                                </Body1>
                                <Body2 className='inline'>
                                    {toNonBreaking(artist)}
                                </Body2>
                                &nbsp;&bull;&#32;
                                <Body1 className='inline'>
                                    {toNonBreaking(title)}
                                </Body1>
                            </div>
                            <div className='flex w-full shrink-0 items-center justify-between gap-2 sm:w-80 lg:w-96'>
                                <Body1 className='w-6 text-center'>
                                    {countStageCalls}
                                </Body1>
                                <div className='h-4 flex-grow'>
                                    <div
                                        style={{
                                            width: showRelative
                                                ? '100%'
                                                : `${maxCount === 0 ? 0 : Math.round((count / maxCount) * 100)}%`,
                                        }}
                                        className='relative h-full overflow-hidden rounded-sm bg-white'
                                    >
                                        <div
                                            style={{
                                                width: `${count === 0 ? 0 : Math.round((countStageCalls / count) * 100)}%`,
                                            }}
                                            className='absolute left-0 top-0 h-full bg-blue-300'
                                        />
                                    </div>
                                </div>
                                <Body1 className='w-6 text-center'>
                                    {count}
                                </Body1>
                            </div>
                        </li>
                    ),
                )}
            </ul>
        </BoxMain>
    )
}
