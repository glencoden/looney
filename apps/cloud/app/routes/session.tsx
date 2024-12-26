import { useSprings } from '@react-spring/web'
import BoxMain from '@repo/ui/components/BoxMain'
import { cn } from '@repo/ui/helpers'
import { useDrag } from '@use-gesture/react'
import { useMemo, useRef, useState } from 'react'
import DragDropList from '~/components/DragDropList/DragDropList'
import { createSpringsCallback } from '~/helpers/create-springs-callback'

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

const FULL_LIP_HEIGHT = 108
const PAGE_SWAP_ON_DRAG_THRESHOLD = 100
const MD_BREAKPOINT = 768

export default function Session() {
    /**
     *
     * Page drag blow md breakpoint
     *
     */

    const [isLeft, setIsLeft] = useState(false)

    const [isPageDragging, setIsPageDragging] = useState(false)
    const [offsetX, setOffsetX] = useState(0)

    const bindPageDrag = useDrag(({ down, movement: [mx] }) => {
        if (!down) {
            setDragScrollTop(null)
            setIsPageDragging(false)
            setOffsetX(0)

            if (Math.abs(mx) > window.innerWidth / 4) {
                setIsLeft((prev) => !prev)
            }
            return
        }
        if (
            stagedContainerRef.current === null ||
            pendingContainerRef.current === null
        ) {
            throw new Error(
                'Expect container element references to be defined.',
            )
        }

        if (dragScrollTop === null) {
            setDragScrollTop([
                stagedContainerRef.current.scrollTop,
                pendingContainerRef.current.scrollTop,
            ])
        }
        setIsPageDragging(true)
        setOffsetX(mx)
    })

    /**
     *
     * Drag and drop lists
     *
     */

    const stagedLips = useMemo(() => {
        return lips.filter((lip) => lip.status === 'staged')
    }, [lips])

    const pendingLips = useMemo(() => {
        return lips.filter((lip) => lip.status === 'pending')
    }, [lips])

    const stagedContainerRef = useRef<HTMLDivElement>(null)
    const pendingContainerRef = useRef<HTMLDivElement>(null)

    const [dragScrollTop, setDragScrollTop] = useState<[number, number] | null>(
        null,
    )

    const [stagedSprings, stagedAPI] = useSprings(
        stagedLips.length,
        createSpringsCallback(),
    )

    const [pendingSprings, pendingAPI] = useSprings(
        pendingLips.length,
        createSpringsCallback(),
    )

    const bindLipDrag = useDrag(
        ({ xy: [vx], movement: [mx, my], down, args: [itemId] }) => {
            if (
                stagedContainerRef.current === null ||
                pendingContainerRef.current === null
            ) {
                throw new Error(
                    'Expect container element references to be defined.',
                )
            }

            if (down && dragScrollTop === null) {
                setDragScrollTop([
                    stagedContainerRef.current.scrollTop,
                    pendingContainerRef.current.scrollTop,
                ])
            }

            /**
             * Drag item context
             */

            const dragItem = lips.find((lip) => lip.id === itemId)

            if (!dragItem) {
                throw new Error('Expect dragItem to be defined.')
            }

            const isPendingList = dragItem.status === 'pending'

            const dragItemList = isPendingList ? pendingLips : stagedLips

            const dragItemIndex = dragItemList.findIndex(
                (item) => item.id === itemId,
            )

            const dragItemContainer = isPendingList
                ? pendingContainerRef.current
                : stagedContainerRef.current

            /**
             * Page swap on mobile
             */

            if (window.innerWidth < MD_BREAKPOINT) {
                if (vx < window.innerWidth / 2 - PAGE_SWAP_ON_DRAG_THRESHOLD) {
                    setIsLeft(true)
                }
                if (vx > window.innerWidth / 2 + PAGE_SWAP_ON_DRAG_THRESHOLD) {
                    setIsLeft(false)
                }
                if (isLeft && isPendingList) {
                    mx -= window.innerWidth
                }
                if (!isLeft && !isPendingList) {
                    mx += window.innerWidth
                }
            }

            /**
             * Movement context
             */

            const isOutOfContainer =
                Math.abs(mx) > dragItemContainer.offsetWidth / 2

            const movedInSiblingDirection =
                (!isPendingList && Math.sign(mx) === 1) ||
                (isPendingList && Math.sign(mx) === -1)

            const isOverSiblingContainer =
                isOutOfContainer && movedInSiblingDirection

            /**
             * Target list index calculation
             */

            let indexShift = 0
            let scrollDiff = 0

            if (isOverSiblingContainer && dragScrollTop !== null) {
                scrollDiff = isPendingList
                    ? dragScrollTop[0] - dragScrollTop[1]
                    : dragScrollTop[1] - dragScrollTop[0]
            }

            const offsetY = my + scrollDiff

            const numRowsShift = Math.floor(
                (Math.abs(offsetY) - FULL_LIP_HEIGHT / 2) / FULL_LIP_HEIGHT,
            )

            indexShift = Math.sign(offsetY) * (1 + numRowsShift)

            let maxTargetIndex =
                (isPendingList && !isOverSiblingContainer) ||
                (!isPendingList && isOverSiblingContainer)
                    ? pendingLips.length
                    : stagedLips.length

            if (!isOverSiblingContainer) {
                maxTargetIndex--
            }

            const targetIndex = Math.min(
                maxTargetIndex,
                Math.max(0, dragItemIndex + indexShift),
            )

            /**
             * Spring API calls
             */

            const api = isPendingList ? pendingAPI : stagedAPI
            const siblingAPI = isPendingList ? stagedAPI : pendingAPI

            if (isOutOfContainer) {
                api.start(
                    createSpringsCallback(down, dragItemIndex, -1, mx, my),
                )
            } else {
                api.start(
                    createSpringsCallback(
                        down,
                        dragItemIndex,
                        targetIndex,
                        mx,
                        my,
                    ),
                )
            }

            if (isOverSiblingContainer) {
                siblingAPI.start(createSpringsCallback(down, -1, targetIndex))
            } else {
                siblingAPI.start(createSpringsCallback())
            }

            if (!down) {
                console.log('itemId', itemId)
                console.log('isOverSiblingContainer', isOverSiblingContainer)
                console.log('dragItemIndex', dragItemIndex)
                console.log('targetIndex', targetIndex)

                setDragScrollTop(null)
            }
        },
    )

    return (
        <BoxMain className='relative'>
            <div
                className={cn('absolute inset-0', {
                    'transition-transform duration-300': !isPageDragging,
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
                                'max-md:scale-95': isPageDragging,
                            },
                        )}
                    >
                        <div className='px-main border-white-500 min-h-12 w-full max-w-96 border-2'>
                            Start field
                        </div>
                        <DragDropList
                            ref={stagedContainerRef}
                            items={stagedLips}
                            springs={stagedSprings}
                            bind={bindLipDrag}
                            fixTop={dragScrollTop && dragScrollTop[0]}
                        />
                    </section>

                    <section
                        className={cn(
                            'flex h-dvh flex-col items-center gap-3 pt-12 transition-transform duration-200 max-md:w-[100vw]',
                            {
                                'max-md:scale-95': isPageDragging,
                            },
                        )}
                    >
                        <div className='px-main border-white-500 min-h-12 w-full max-w-96 border-2'>
                            Search field
                        </div>
                        <DragDropList
                            ref={pendingContainerRef}
                            items={pendingLips}
                            springs={pendingSprings}
                            bind={bindLipDrag}
                            fixTop={dragScrollTop && dragScrollTop[1]}
                        />
                    </section>

                    <div
                        {...bindPageDrag()}
                        className='absolute bottom-0 left-1/2 h-32 w-80 -translate-x-1/2 touch-none select-none rounded-lg bg-white/10 md:hidden'
                    />
                </div>
            </div>
        </BoxMain>
    )
}
