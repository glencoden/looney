import { Form, Link, useLoaderData, useSearchParams } from '@remix-run/react'
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
import { json } from '@vercel/remix'
import {
    AlignJustify,
    AlignLeft,
    ArrowDown,
    ArrowLeft,
    ArrowUp,
} from 'lucide-react'
import { toNonBreaking } from 'node_modules/@repo/utils/dist/text/to-non-breaking'
import { useState } from 'react'

export const loader = async ({ request }: { request: Request }) => {
    const url = new URL(request.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    const songInsights = await getSongInsights({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
    })

    return json({ songInsights })
}

export default function Insights() {
    const { songInsights } = useLoaderData<typeof loader>()

    const [searchParams, setSearchParams] = useSearchParams()

    const totalSessions = new Set(
        songInsights.flatMap(({ sessionIds }) => sessionIds),
    ).size
    const totalCount = songInsights.reduce((acc, { count }) => acc + count, 0)
    const totalCallsToStage = songInsights.reduce(
        (acc, { countStageCalls }) => acc + countStageCalls,
        0,
    )
    const maxCount = Math.max(...songInsights.map(({ count }) => count))

    const [showRelative, setShowRelative] = useState(false)

    const [sortBy, setSortBy] = useState<'count' | 'calls' | 'ratio'>('count')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    return (
        <BoxMain>
            <Button asChild className='float-start' variant='ghost' size='icon'>
                <Link to='/'>
                    <ArrowLeft className='h-6 w-6 text-white' />
                </Link>
            </Button>

            <H3 className='min-h-9 px-10'>Insights</H3>

            <section className='mt-10 flex justify-between'>
                <Form method='get' className='space-y-2'>
                    <div className='flex flex-wrap gap-2'>
                        <div className='space-y-2'>
                            <Subtitle2>Start</Subtitle2>
                            <Input
                                type='date'
                                name='startDate'
                                aria-label='Start date'
                                placeholder='Start date'
                                defaultValue={
                                    searchParams.get('startDate') || ''
                                }
                            />
                        </div>
                        <div className='space-y-2'>
                            <Subtitle2>End</Subtitle2>
                            <Input
                                type='date'
                                name='endDate'
                                aria-label='End date'
                                placeholder='End date'
                                defaultValue={searchParams.get('endDate') || ''}
                            />
                        </div>
                    </div>
                    <div className='space-x-2 pt-2'>
                        <Button className='inline-flex' size='sm' type='submit'>
                            Apply
                        </Button>
                        <Button
                            className='inline-flex'
                            size='sm'
                            variant='secondary'
                            type='reset'
                            onClick={() => {
                                setSearchParams({})
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                </Form>

                <Button
                    variant='ghost'
                    size='auto'
                    onClick={() => setShowRelative(!showRelative)}
                >
                    {showRelative ? <AlignJustify /> : <AlignLeft />}
                </Button>
            </section>

            <ul className='mt-8 space-y-2'>
                <div className='flex flex-wrap items-center justify-between gap-2 py-2'>
                    <Subtitle2>
                        {totalSessions} Sessions &nbsp;&bull;&nbsp;
                        {songInsights.length} Songs
                    </Subtitle2>
                    <div className='flex w-full justify-between gap-2 sm:w-80 lg:w-96'>
                        <Button
                            variant='ghost'
                            size='auto'
                            onClick={() => {
                                if (sortBy === 'calls') {
                                    setSortOrder(
                                        sortOrder === 'asc' ? 'desc' : 'asc',
                                    )
                                    return
                                }
                                setSortBy('calls')
                                setSortOrder('desc')
                            }}
                        >
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
                        </Button>
                        <Button
                            variant='ghost'
                            size='auto'
                            onClick={() => {
                                if (sortBy === 'ratio') {
                                    setSortOrder(
                                        sortOrder === 'asc' ? 'desc' : 'asc',
                                    )
                                    return
                                }
                                setSortBy('ratio')
                                setSortOrder('desc')
                            }}
                        >
                            {sortBy === 'ratio' && sortOrder === 'asc' && (
                                <ArrowDown className='h-4 w-4 shrink-0' />
                            )}
                            {sortBy === 'ratio' && sortOrder === 'desc' && (
                                <ArrowUp className='h-4 w-4 shrink-0' />
                            )}
                            Ratio
                        </Button>
                        <Button
                            variant='ghost'
                            size='auto'
                            onClick={() => {
                                if (sortBy === 'count') {
                                    setSortOrder(
                                        sortOrder === 'asc' ? 'desc' : 'asc',
                                    )
                                    return
                                }
                                setSortBy('count')
                                setSortOrder('desc')
                            }}
                        >
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
                        </Button>
                    </div>
                </div>

                {songInsights
                    .sort((a, b) => {
                        if (sortBy === 'calls') {
                            return sortOrder === 'asc'
                                ? a.countStageCalls - b.countStageCalls
                                : b.countStageCalls - a.countStageCalls
                        }
                        if (sortBy === 'ratio') {
                            const ratioA = a.countStageCalls / a.count
                            const ratioB = b.countStageCalls / b.count
                            return sortOrder === 'asc'
                                ? ratioA - ratioB
                                : ratioB - ratioA
                        }
                        return sortOrder === 'asc'
                            ? a.count - b.count
                            : b.count - a.count
                    })
                    .map(
                        (
                            { id, artist, title, count, countStageCalls },
                            index,
                        ) => (
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
                                                    : `${Math.round((count / maxCount) * 100)}%`,
                                            }}
                                            className='relative h-full overflow-hidden rounded-sm bg-white'
                                        >
                                            <div
                                                style={{
                                                    width: `${Math.round((countStageCalls / count) * 100)}%`,
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
