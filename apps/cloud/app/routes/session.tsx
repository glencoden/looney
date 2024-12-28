import { useSpring, useSprings } from '@react-spring/web'
import BoxMain from '@repo/ui/components/BoxMain'
import { cn } from '@repo/ui/helpers'
import { useDrag } from '@use-gesture/react'
import { useMemo, useRef, useState } from 'react'
import DragDropList from '~/components/DragDropList'
import DragDropListItem from '~/components/DragDropListItem'
import { createSpringEffect } from '~/helpers/create-spring-effect'

type Lip = {
    id: string
    songTitle: string
    artistName: string
    singerName: string
    status: 'idle' | 'selected' | 'staged' | 'live' | 'done' | 'deleted'
    sortNumber: number
}

const lips: Lip[] = [
    {
        id: 'dmvdhftysh74hf',
        songTitle: 'Hit me baby one more time',
        artistName: 'Britney Spears',
        singerName: 'Josi Schmidt',
        status: 'staged',
        sortNumber: 1,
    },
    {
        id: 'djvhy783hnfh',
        songTitle: 'Summer of 69',
        artistName: 'Bryan Adams',
        singerName: 'Bernard Hufstein',
        status: 'idle',
        sortNumber: 2,
    },
    {
        id: 'ehfut8rt83urhfufiu',
        songTitle: 'I want to break free',
        artistName: 'Queen',
        singerName: 'Lisa Müller',
        status: 'idle',
        sortNumber: 3,
    },
    {
        id: '92927eyhfhcjhj',
        songTitle: 'Shake it off',
        artistName: 'Taylor Swift',
        singerName: 'Josi Schmidt',
        status: 'selected',
        sortNumber: 4,
    },
    {
        id: 'oaxnfhr64u83hj',
        songTitle: 'Blinding Lights',
        artistName: 'The Weeknd',
        singerName: 'Rebecca Erler',
        status: 'selected',
        sortNumber: 5,
    },
    {
        id: 'mvdhftyh74hf',
        songTitle: 'Hit me baby one more time',
        artistName: 'Britney Spears',
        singerName: 'Josi Schmidt',
        status: 'idle',
        sortNumber: 6,
    },
    {
        id: 'jvhy78hnfh',
        songTitle: 'Summer of 69',
        artistName: 'Bryan Adams',
        singerName: 'Bernard Hufstein',
        status: 'idle',
        sortNumber: 7,
    },
    {
        id: 'hfut8rt83rhfufiu',
        songTitle: 'I want to break free',
        artistName: 'Queen',
        singerName: 'Lisa Müller',
        status: 'selected',
        sortNumber: 8,
    },
    {
        id: '2927eyfhcjhj',
        songTitle: 'Shake it off',
        artistName: 'Taylor Swift',
        singerName: 'Josi Schmidt',
        status: 'idle',
        sortNumber: 9,
    },
    {
        id: 'axnfhr4u83hj',
        songTitle: 'Blinding Lights',
        artistName: 'The Weeknd',
        singerName: 'Rebecca Erler',
        status: 'idle',
        sortNumber: 10,
    },
    {
        id: '2927eyfhc234fjhj',
        songTitle: 'Shake it off',
        artistName: 'Taylor Swift',
        singerName: 'Josi Schmidt',
        status: 'idle',
        sortNumber: 11,
    },
    {
        id: 'axnfhr23fr4u83hj',
        songTitle: 'Blinding Lights',
        artistName: 'The Weeknd',
        singerName: 'Rebecca Erler',
        status: 'idle',
        sortNumber: 12,
    },
    {
        id: '292723feyfhcjhj',
        songTitle: 'Shake it off',
        artistName: 'Taylor Swift',
        singerName: 'Josi Schmidt',
        status: 'idle',
        sortNumber: 13,
    },
    {
        id: 'axnfhr23f4u83hj',
        songTitle: 'Blinding Lights',
        artistName: 'The Weeknd',
        singerName: 'Rebecca Erler',
        status: 'idle',
        sortNumber: 14,
    },
]

const FULL_LIP_HEIGHT = 108 // px, lip height 96 + list gap 12
const FULL_ACTION_LIP_BOX_HEIGHT = 124 // px, lip box height 112 + list gap 12
const MD_BREAKPOINT = 768 // px, tailwind md breakpoint
const HORIZONTAL_DRAG_ACTION_THRESHOLD = 96 // px

enum BoxType {
    LEFT = 'left',
    RIGHT = 'right',
    ACTION = 'action',
}

type PageInView = 'left' | 'right'

export default function Session() {
    const leftScrollBoxRef = useRef<HTMLDivElement>(null)
    const rightScrollBoxRef = useRef<HTMLDivElement>(null)

    const [scrollTopLock, setScrollTopLock] = useState<[number, number] | null>(
        null,
    )

    const lockScroll = () => {
        if (
            leftScrollBoxRef.current === null ||
            rightScrollBoxRef.current === null
        ) {
            throw new Error('Expect box element references to be defined.')
        }

        if (scrollTopLock === null) {
            setScrollTopLock([
                leftScrollBoxRef.current.scrollTop,
                rightScrollBoxRef.current.scrollTop,
            ])
        }
    }

    const unlockScroll = () => {
        setScrollTopLock(null)
    }

    /**
     *
     * Page drag below md breakpoint
     *
     */

    const [pageInView, setPageInView] = useState<PageInView>('left')
    const [isPageDragging, setIsPageDragging] = useState(false)
    const [pageOffsetX, setPageOffsetX] = useState(0)

    const bindPageDrag = useDrag(({ down, movement: [mx] }) => {
        if (!down) {
            unlockScroll()
            setIsPageDragging(false)
            setPageOffsetX(0)

            if (Math.abs(mx) > window.innerWidth / 4) {
                setPageInView(Math.sign(mx) === 1 ? 'left' : 'right')
            }
            return
        }

        lockScroll()
        setIsPageDragging(true)
        setPageOffsetX(mx)
    })

    /**
     *
     * Drag and drop lists and APIs
     *
     */

    const idleLips = useMemo(() => {
        return lips.filter((lip) => lip.status === 'idle')
    }, [lips])

    const selectedLips = useMemo(() => {
        return lips.filter((lip) => lip.status === 'selected')
    }, [lips])

    const actionLip = useMemo(() => {
        return lips.find(
            (lip) => lip.status === 'staged' || lip.status === 'live',
        )
    }, [lips])

    const defaultSpringEffect = createSpringEffect()

    const [idleSprings, idleAPI] = useSprings(
        idleLips.length,
        defaultSpringEffect,
    )

    const [selectedSprings, selectedAPI] = useSprings(
        selectedLips.length,
        defaultSpringEffect,
    )

    const [actionSpring, actionAPI] = useSpring(defaultSpringEffect)

    const [isActionTarget, setIsActionTarget] = useState(false)

    /**
     *
     * Lip drag and drop
     *
     */

    const bindLipDrag = useDrag(
        ({ xy: [vx, vy], movement: [mx, my], down, args: [lipId] }) => {
            lockScroll()

            if (
                leftScrollBoxRef.current === null ||
                rightScrollBoxRef.current === null ||
                leftScrollBoxRef.current.offsetWidth !==
                    rightScrollBoxRef.current.offsetWidth ||
                leftScrollBoxRef.current.offsetTop !==
                    rightScrollBoxRef.current.offsetTop
            ) {
                throw new Error(
                    'Expect drag drop list box references to be defined, have the same width and the same top offset.',
                )
            }

            const dragBoxWidth = leftScrollBoxRef.current.offsetWidth

            const dragItem = lips.find((lip) => lip.id === lipId)

            if (!dragItem) {
                throw new Error('Expect dragItem to be defined.')
            }

            /**
             * Delete and finish flags
             */

            let finishOnDrop = false
            let deleteOnDrop = false

            if (
                vx < window.innerWidth / 2 - HORIZONTAL_DRAG_ACTION_THRESHOLD &&
                dragItem.status === 'live'
            ) {
                finishOnDrop = true
            }
            if (
                vx > window.innerWidth / 2 + HORIZONTAL_DRAG_ACTION_THRESHOLD &&
                dragItem.status === 'idle'
            ) {
                deleteOnDrop = true
            }

            /**
             * Page swap on mobile
             */

            if (window.innerWidth < MD_BREAKPOINT) {
                if (
                    vx <
                        window.innerWidth / 2 -
                            HORIZONTAL_DRAG_ACTION_THRESHOLD &&
                    pageInView === 'right'
                ) {
                    setPageInView('left')
                }
                if (
                    vx >
                        window.innerWidth / 2 +
                            HORIZONTAL_DRAG_ACTION_THRESHOLD &&
                    pageInView === 'left'
                ) {
                    setPageInView('right')
                }
                if (pageInView === 'left' && dragItem.status === 'idle') {
                    mx -= window.innerWidth
                }
                if (pageInView === 'right' && dragItem.status !== 'idle') {
                    mx += window.innerWidth
                }
            }

            /**
             * Find drag and target box
             */

            let dragBox: BoxType | undefined
            let targetBox: BoxType | undefined

            switch (dragItem.status) {
                case 'idle': {
                    dragBox = BoxType.RIGHT

                    if (mx > (-1 * dragBoxWidth) / 2) {
                        targetBox = BoxType.RIGHT
                    } else {
                        if (vy > leftScrollBoxRef.current.offsetTop) {
                            targetBox = BoxType.LEFT
                        } else {
                            targetBox = BoxType.ACTION
                        }
                    }
                    break
                }
                case 'selected': {
                    dragBox = BoxType.LEFT

                    if (mx > dragBoxWidth / 2) {
                        targetBox = BoxType.RIGHT
                    } else {
                        if (vy > leftScrollBoxRef.current.offsetTop) {
                            targetBox = BoxType.LEFT
                        } else {
                            targetBox = BoxType.ACTION
                        }
                    }
                    break
                }
                case 'staged':
                case 'live': {
                    dragBox = BoxType.ACTION

                    if (vy < leftScrollBoxRef.current.offsetTop) {
                        targetBox = BoxType.ACTION
                    } else {
                        if (mx > dragBoxWidth / 2) {
                            targetBox = BoxType.RIGHT
                        } else {
                            targetBox = BoxType.LEFT
                        }
                    }
                    break
                }
                default:
                    throw new Error('Unexpected drag item status.')
            }

            /**
             * Target list index calculation (action target is no list and needs no index)
             */

            let dragIndex = 0

            switch (dragBox) {
                case BoxType.LEFT:
                    dragIndex = selectedLips.findIndex(
                        (lip) => lip.id === dragItem.id,
                    )
                    break
                case BoxType.RIGHT:
                    dragIndex = idleLips.findIndex(
                        (lip) => lip.id === dragItem.id,
                    )
                    break
            }

            let indexShift = 0 // index
            let offsetTopDiff = 0 // px

            if (scrollTopLock !== null) {
                if (dragBox === BoxType.LEFT && targetBox === BoxType.RIGHT) {
                    offsetTopDiff = scrollTopLock[1] - scrollTopLock[0]
                }
                if (dragBox === BoxType.RIGHT && targetBox === BoxType.LEFT) {
                    offsetTopDiff = scrollTopLock[0] - scrollTopLock[1]
                }
                if (dragBox === BoxType.ACTION) {
                    if (targetBox === BoxType.LEFT) {
                        offsetTopDiff =
                            scrollTopLock[0] - FULL_ACTION_LIP_BOX_HEIGHT
                    }
                    if (targetBox === BoxType.RIGHT) {
                        offsetTopDiff =
                            scrollTopLock[1] - FULL_ACTION_LIP_BOX_HEIGHT
                    }
                }
            }

            const offsetY = my + offsetTopDiff

            const numRowsShift = Math.floor(
                (Math.abs(offsetY) - FULL_LIP_HEIGHT / 2) / FULL_LIP_HEIGHT,
            )

            indexShift = Math.sign(offsetY) * (1 + numRowsShift)

            let maxTargetIndex = 0

            switch (targetBox) {
                case BoxType.LEFT:
                    maxTargetIndex = selectedLips.length
                    break
                case BoxType.RIGHT:
                    maxTargetIndex = idleLips.length
                    break
            }

            if (dragBox === targetBox) {
                maxTargetIndex--
            }

            const targetIndex = Math.min(
                maxTargetIndex,
                Math.max(0, dragIndex + indexShift),
            )

            /**
             * Spring API calls
             */

            setIsActionTarget(targetBox === BoxType.ACTION)

            const sameTargetDragSpringEffect = createSpringEffect(
                down,
                dragIndex,
                targetIndex,
                mx,
                my,
            )

            const siblingTargetDragSpringEffect = createSpringEffect(
                down,
                dragIndex,
                -1,
                mx,
                my,
            )

            const targetSpringEffect = createSpringEffect(down, -1, targetIndex)

            switch (dragBox) {
                case BoxType.LEFT: {
                    switch (targetBox) {
                        case BoxType.LEFT:
                            selectedAPI.start(sameTargetDragSpringEffect)
                            idleAPI.start(defaultSpringEffect)
                            actionAPI.start(defaultSpringEffect)
                            break
                        case BoxType.RIGHT:
                            selectedAPI.start(siblingTargetDragSpringEffect)
                            idleAPI.start(targetSpringEffect)
                            break
                        case BoxType.ACTION:
                            selectedAPI.start(siblingTargetDragSpringEffect)
                            idleAPI.start(defaultSpringEffect)
                            break
                    }
                    break
                }
                case BoxType.RIGHT: {
                    switch (targetBox) {
                        case BoxType.LEFT:
                            idleAPI.start(siblingTargetDragSpringEffect)
                            selectedAPI.start(targetSpringEffect)
                            break
                        case BoxType.RIGHT:
                            idleAPI.start(sameTargetDragSpringEffect)
                            selectedAPI.start(defaultSpringEffect)
                            break
                        case BoxType.ACTION:
                            idleAPI.start(siblingTargetDragSpringEffect)
                            selectedAPI.start(defaultSpringEffect)
                            break
                    }
                    break
                }
                case BoxType.ACTION: {
                    actionAPI.start(createSpringEffect(down, 0, 0, mx, my))

                    switch (targetBox) {
                        case BoxType.LEFT:
                            selectedAPI.start(targetSpringEffect)
                            idleAPI.start(defaultSpringEffect)
                            break
                        case BoxType.RIGHT:
                            selectedAPI.start(defaultSpringEffect)
                            idleAPI.start(targetSpringEffect)
                            break
                        case BoxType.ACTION:
                            selectedAPI.start(defaultSpringEffect)
                            idleAPI.start(defaultSpringEffect)
                            break
                    }
                    break
                }
            }

            if (!down) {
                console.log('LIP ID', lipId)

                console.log('FINISH', finishOnDrop)
                console.log('DELETE', deleteOnDrop)

                console.log('DRAG BOX', dragBox)
                console.log('TARGET BOX', targetBox)
                console.log('DRAG INDEX', dragIndex)
                console.log('TARGET INDEX', targetIndex)

                unlockScroll()
            }
        },
    )

    return (
        <BoxMain className='relative'>
            <div
                className={cn('absolute inset-0', {
                    'transition-transform duration-300': !isPageDragging,
                })}
                style={{ transform: `translateX(${pageOffsetX}px)` }}
            >
                <div
                    className={cn(
                        'grid grid-cols-2 transition-transform duration-300 max-md:absolute max-md:left-0 max-md:top-0 max-md:w-[200vw]',
                        {
                            'max-md:-translate-x-[100vw]':
                                pageInView === 'right',
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
                        <div className='px-main border-white-500 h-[112px] w-full shrink-0 border-2'>
                            <div
                                className={cn(
                                    'm-auto flex h-full w-full max-w-96 items-center justify-center border border-lime-400',
                                    {
                                        'border-4': isActionTarget,
                                    },
                                )}
                            >
                                {actionLip && (
                                    <DragDropListItem
                                        lip={actionLip}
                                        spring={actionSpring}
                                        bind={bindLipDrag}
                                    />
                                )}
                            </div>
                        </div>

                        <DragDropList
                            ref={leftScrollBoxRef}
                            lips={selectedLips}
                            springs={selectedSprings}
                            bind={bindLipDrag}
                            fixTop={scrollTopLock && scrollTopLock[0]}
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
                        <div className='px-main border-white-500 h-[112px] w-full shrink-0 border-2'>
                            <div className='m-auto flex h-full w-full max-w-96 items-center justify-center border-2 border-lime-400'>
                                Search field
                            </div>
                        </div>

                        <DragDropList
                            ref={rightScrollBoxRef}
                            lips={idleLips}
                            springs={idleSprings}
                            bind={bindLipDrag}
                            fixTop={scrollTopLock && scrollTopLock[1]}
                        />
                    </section>

                    <div
                        {...bindPageDrag()}
                        className='absolute bottom-0 left-1/2 h-32 w-[calc(100vw-96px)] -translate-x-1/2 touch-none select-none md:hidden'
                    />
                </div>
            </div>
        </BoxMain>
    )
}
