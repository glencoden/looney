import { Link, useLoaderData } from '@remix-run/react'
import { getSongsCount } from '@repo/db/queries'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import Body2 from '@repo/ui/typography/Body2'
import H3 from '@repo/ui/typography/H3'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { json } from '@vercel/remix'
import { ArrowLeft } from 'lucide-react'
import { toNonBreaking } from 'node_modules/@repo/utils/dist/text/to-non-breaking'

export const loader = async () => {
    const songsCount = await getSongsCount()

    return json({ songsCount })
}

export default function Insights() {
    const { songsCount } = useLoaderData<typeof loader>()

    const totalCount = songsCount.reduce((acc, { count }) => acc + count, 0)
    const totalCallsToStage = songsCount.reduce(
        (acc, { countStageCalls }) => acc + countStageCalls,
        0,
    )

    return (
        <BoxMain>
            <Button asChild className='float-start' variant='ghost' size='icon'>
                <Link to='/'>
                    <ArrowLeft className='h-6 w-6 text-white' />
                </Link>
            </Button>

            <H3 className='min-h-9 px-10'>Insights</H3>

            <div className='mt-10 grid grid-cols-3 gap-4'>
                <div className='flex flex-col gap-2'>
                    <Subtitle2>Filter</Subtitle2>
                    <Button>Sessions</Button>
                </div>
                <div className='flex flex-col gap-2'>
                    <Subtitle2>Sort</Subtitle2>
                    <Button>Total</Button>
                </div>
                <div className='flex flex-col gap-2'>
                    <Subtitle2>View</Subtitle2>
                    <Button>Absolute</Button>
                </div>
            </div>

            <ul className='mt-8 space-y-2'>
                <div className='flex justify-between'>
                    <div />
                    <div className='flex w-80 justify-between gap-2 max-sm:w-full'>
                        <Body2>Called to stage ({totalCallsToStage})</Body2>
                        <Body2>Total ({totalCount})</Body2>
                    </div>
                </div>

                {songsCount.map(
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
                                <Body2 className='inline'>
                                    {toNonBreaking(artist)}
                                </Body2>
                                &nbsp;&bull;&#32;
                                <Body1 className='inline'>
                                    {toNonBreaking(title)}
                                </Body1>
                            </div>
                            <div className='flex w-80 shrink-0 items-center justify-between gap-2 max-sm:w-full'>
                                <Body1 className='w-6 text-center'>
                                    {countStageCalls}
                                </Body1>
                                <div className='relative h-4 flex-grow overflow-hidden rounded-sm bg-white'>
                                    <div
                                        style={{
                                            width: `${Math.round((countStageCalls / count) * 100)}%`,
                                        }}
                                        className='absolute left-0 top-0 h-full bg-blue-300'
                                    />
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
