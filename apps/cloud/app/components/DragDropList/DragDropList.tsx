import { animated, useSprings } from '@react-spring/web'
import SongLip from '@repo/ui/components/SongLip'
import { cn } from '@repo/ui/helpers'
import { useDrag } from '@use-gesture/react'
import { useMemo, useState } from 'react'
import { createSpringsCallback } from '~/components/DragDropList/helpers/create-springs-callback'

type Lip = {
    id: string
    songTitle: string
    artistName: string
    singerName: string
    status: 'pending' | 'staged' | 'live' | 'done' | 'deleted'
    sortNumber: number
}

export default function DragDropList({
    lips,
    listStatus,
    preventScroll,
}: {
    lips: Lip[]
    listStatus: Lip['status']
    preventScroll?: boolean
}) {
    const filtered = useMemo(() => {
        return lips.filter((lip) => lip.status === listStatus)
    }, [lips])

    const [isDragging, setIsDragging] = useState(false)

    const [springs, api] = useSprings(filtered.length, createSpringsCallback())

    const bind = useDrag(({ args: [itemId], active, movement: [mx, my] }) => {
        // const horizontalThreshold = 100

        const activeIndex = filtered.findIndex((item) => item.id === itemId)

        const fullLipHeight = 108

        let indexShift = 0

        if (Math.abs(my) > fullLipHeight / 2) {
            const numRowsShift = Math.floor(
                (Math.abs(my) - fullLipHeight / 2) / fullLipHeight,
            )
            indexShift = Math.sign(my) * (1 + numRowsShift)
        }

        const targetIndex = activeIndex + indexShift

        api.start(
            createSpringsCallback(active, activeIndex, targetIndex, mx, my),
        )

        setIsDragging(active)

        if (!active) {
            // Update server state
        }
    })

    return (
        <div
            className={cn(
                'px-main relative flex w-full flex-grow flex-col items-center gap-3 overflow-y-scroll pb-24',
                {
                    'overflow-y-hidden': isDragging || preventScroll,
                },
            )}
        >
            {springs.map(({ zIndex, shadow, x, y, scale }, index) => {
                const item = filtered[index]

                if (!item) {
                    throw new Error('Expect item to be defined')
                }

                return (
                    <animated.div
                        key={item.id}
                        className='relative w-full max-w-96'
                        style={{
                            zIndex,
                            boxShadow: shadow.to(
                                (s) =>
                                    `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
                            ),
                            x,
                            y,
                            scale,
                        }}
                        children={
                            <>
                                <SongLip key={item.id} lip={item} />
                                <div
                                    {...bind(item.id)}
                                    className='absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 touch-none select-none'
                                />
                            </>
                        }
                    />
                )
            })}
        </div>
    )
}
