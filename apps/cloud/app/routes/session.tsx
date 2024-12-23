import BoxMain from '@repo/ui/components/BoxMain'
import { cn } from '@repo/ui/helpers'
import { useDrag } from '@use-gesture/react'
import { useState } from 'react'
import DragDropList from '~/components/DragDropList/DragDropList'

type Lip = {
    id: string
    songTitle: string
    artistName: string
    singerName: string
    status: 'pending' | 'staged' | 'live' | 'done' | 'deleted'
    sortNumber: number
}

const lips: Lip[] = [
    {
        id: 'dmvdhftysh74hf',
        songTitle: 'Hit me baby one more time',
        artistName: 'Britney Spears',
        singerName: 'Josi Schmidt',
        status: 'pending',
        sortNumber: 1,
    },
    {
        id: 'djvhy783hnfh',
        songTitle: 'Summer of 69',
        artistName: 'Bryan Adams',
        singerName: 'Bernard Hufstein',
        status: 'pending',
        sortNumber: 2,
    },
    {
        id: 'ehfut8rt83urhfufiu',
        songTitle: 'I want to break free',
        artistName: 'Queen',
        singerName: 'Lisa Müller',
        status: 'pending',
        sortNumber: 3,
    },
    {
        id: '92927eyhfhcjhj',
        songTitle: 'Shake it off',
        artistName: 'Taylor Swift',
        singerName: 'Josi Schmidt',
        status: 'staged',
        sortNumber: 4,
    },
    {
        id: 'oaxnfhr64u83hj',
        songTitle: 'Blinding Lights',
        artistName: 'The Weeknd',
        singerName: 'Rebecca Erler',
        status: 'staged',
        sortNumber: 5,
    },
    {
        id: 'mvdhftyh74hf',
        songTitle: 'Hit me baby one more time',
        artistName: 'Britney Spears',
        singerName: 'Josi Schmidt',
        status: 'pending',
        sortNumber: 6,
    },
    {
        id: 'jvhy78hnfh',
        songTitle: 'Summer of 69',
        artistName: 'Bryan Adams',
        singerName: 'Bernard Hufstein',
        status: 'pending',
        sortNumber: 7,
    },
    {
        id: 'hfut8rt83rhfufiu',
        songTitle: 'I want to break free',
        artistName: 'Queen',
        singerName: 'Lisa Müller',
        status: 'staged',
        sortNumber: 8,
    },
    {
        id: '2927eyfhcjhj',
        songTitle: 'Shake it off',
        artistName: 'Taylor Swift',
        singerName: 'Josi Schmidt',
        status: 'pending',
        sortNumber: 9,
    },
    {
        id: 'axnfhr4u83hj',
        songTitle: 'Blinding Lights',
        artistName: 'The Weeknd',
        singerName: 'Rebecca Erler',
        status: 'pending',
        sortNumber: 10,
    },
    {
        id: '2927eyfhc234fjhj',
        songTitle: 'Shake it off',
        artistName: 'Taylor Swift',
        singerName: 'Josi Schmidt',
        status: 'pending',
        sortNumber: 11,
    },
    {
        id: 'axnfhr23fr4u83hj',
        songTitle: 'Blinding Lights',
        artistName: 'The Weeknd',
        singerName: 'Rebecca Erler',
        status: 'pending',
        sortNumber: 12,
    },
    {
        id: '292723feyfhcjhj',
        songTitle: 'Shake it off',
        artistName: 'Taylor Swift',
        singerName: 'Josi Schmidt',
        status: 'pending',
        sortNumber: 13,
    },
    {
        id: 'axnfhr23f4u83hj',
        songTitle: 'Blinding Lights',
        artistName: 'The Weeknd',
        singerName: 'Rebecca Erler',
        status: 'pending',
        sortNumber: 14,
    },
]

// TODO: w-64 should be (100vw - lip drag section with) / 2

export default function Session() {
    const [isLeft, setIsLeft] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [offsetX, setOffsetX] = useState(0)

    const bindDrag = useDrag(({ down, movement: [mx] }) => {
        if (!down) {
            setIsDragging(false)
            setOffsetX(0)

            if (Math.abs(mx) > window.innerWidth / 4) {
                setIsLeft((prev) => !prev)
            }
            return
        }
        setIsDragging(true)
        setOffsetX(mx)
    })

    console.log('RENDER SESSION')

    return (
        <BoxMain className='relative'>
            <div
                className={cn('absolute inset-0', {
                    'transition-transform duration-300': !isDragging,
                })}
                style={{ transform: `translateX(${offsetX}px)` }}
            >
                <div
                    className={cn(
                        'grid grid-cols-2 transition-transform duration-300 max-md:absolute max-md:left-0 max-md:top-0 max-md:w-[200vw]',
                        {
                            'max-md:-translate-x-[100vw]': !isLeft,
                        },
                    )}
                >
                    <section
                        className={cn(
                            'flex h-dvh flex-col items-center gap-3 pt-12 transition-transform duration-200 max-md:w-[100vw]',
                            {
                                'max-md:scale-95': isDragging,
                            },
                        )}
                    >
                        <div className='px-main border-white-500 min-h-12 w-full max-w-96 border-2'>
                            Start field
                        </div>
                        <DragDropList
                            lips={lips}
                            listStatus='staged'
                            preventScroll={isDragging}
                        />
                    </section>

                    <section
                        className={cn(
                            'flex h-dvh flex-col items-center gap-3 pt-12 transition-transform duration-200 max-md:w-[100vw]',
                            {
                                'max-md:scale-95': isDragging,
                            },
                        )}
                    >
                        <div className='px-main border-white-500 min-h-12 w-full max-w-96 border-2'>
                            Search field
                        </div>
                        <DragDropList
                            lips={lips}
                            listStatus='pending'
                            preventScroll={isDragging}
                        />
                    </section>

                    <div
                        {...bindDrag()}
                        className='absolute bottom-0 left-1/2 h-32 w-64 -translate-x-1/2 touch-none select-none rounded-lg bg-white/10 md:hidden'
                    />
                </div>
            </div>
        </BoxMain>
    )
}
