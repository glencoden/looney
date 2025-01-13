import { useSpring, useSprings } from '@react-spring/web'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { LipDTO } from '@repo/api'
import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import { getSession } from '@repo/db/queries'
import BoxMain from '@repo/ui/components/BoxMain'
import Button from '@repo/ui/components/Button'
import Input from '@repo/ui/components/Input'
import { cn } from '@repo/ui/helpers'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { useDrag } from '@use-gesture/react'
import { PlayCircle, Radio } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import AddDemoLipButton from '~/components/AddDemoLipButton'
import DragDropList from '~/components/DragDropList'
import DragDropListItem from '~/components/DragDropListItem'
import SessionMenu from '~/components/SessionMenu'
import { createSpringEffect } from '~/helpers/create-spring-effect'

const FULL_LIP_HEIGHT = 108 // px, lip height 96 + list gap 12
const FULL_ACTION_LIP_BOX_HEIGHT = 124 // px, lip box height 112 + list gap 12
const MD_BREAKPOINT = 768 // px, tailwind md breakpoint
const MAX_CONTAINER_WIDTH = 1280 // px
const HORIZONTAL_DRAG_ACTION_THRESHOLD = 96 // px
const DRAG_DROP_LIST_HEADER_HEIGHT_MOBILE = 144 // px
const DRAG_DROP_LIST_HEADER_HEIGHT_DESKTOP = 160 // px

enum BoxType {
    LEFT = 'left',
    RIGHT = 'right',
    ACTION = 'action',
}

type PageInView = 'left' | 'right'

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const sessionId = z.string().parse(params.sessionId)
    const session = await getSession(sessionId)

    if (!session) {
        throw new Response('Not Found', { status: 404 })
    }

    return json({ session })
}

const parseLoaderSession = (
    session: ReturnType<typeof useLoaderData<typeof loader>>['session'],
): Session => {
    return {
        ...session,
        startsAt: new Date(session.startsAt),
        endsAt: new Date(session.endsAt),
        createdAt: session.createdAt ? new Date(session.createdAt) : null,
    }
}

export default function ActiveSession() {
    const navigate = useNavigate()

    /**
     *
     * Sever state
     *
     */

    const { session: sessionFromLoader } = useLoaderData<typeof loader>()

    const utils = api.useUtils()

    useLayoutEffect(() => {
        utils.session.get.setData(
            { id: sessionFromLoader.id },
            parseLoaderSession(sessionFromLoader),
        )
    }, [utils])

    const { data: sessionFromCache } = api.session.get.useQuery({
        id: sessionFromLoader.id,
    })

    // Fallback to loader session as long as query cache update is pending
    const session =
        sessionFromCache === undefined
            ? parseLoaderSession(sessionFromLoader)
            : sessionFromCache

    if (session === null) {
        throw new Error(
            'If the session is null, there was no session found in the BE, so this should not render.',
        )
    }

    const {
        data,
        isLoading: isLipsLoading,
        isFetching: isLipsFetching,
    } = api.lip.getBySessionId.useQuery(
        { id: session.id },
        {
            refetchInterval: 1000 * 60,
        },
    )

    const lips = data ?? ([] as LipDTO[])

    const { mutate: updateLip, isPending: isLipUpdatePending } =
        api.lip.update.useMutation({
            onSettled: () => {
                void utils.lip.getBySessionId.invalidate({ id: session.id })
            },
        })

    const { mutate: moveLip, isPending: isLipMovePending } =
        api.lip.move.useMutation({
            onSettled: () => {
                void utils.lip.getBySessionId.invalidate({ id: session.id })
            },
        })

    /**
     *
     * Check for session expiry
     *
     */

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>

        const checkSessionExpired = () => {
            return setTimeout(() => {
                if (session.endsAt < new Date()) {
                    navigate('/', { replace: true })
                    return
                }
                timeoutId = checkSessionExpired()
            }, 1000 * 10)
        }

        timeoutId = checkSessionExpired()

        return () => {
            clearTimeout(timeoutId)
        }
    }, [session.endsAt.toISOString()])

    /**
     *
     * Local state
     *
     */

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

    const [pageInView, setPageInView] = useState<PageInView>('right')
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

    const [q, setQ] = useState('')

    const idleLips = useMemo(() => {
        return lips.filter(
            (lip) =>
                lip.status === 'idle' &&
                (lip.singerName.toLowerCase().includes(q.toLowerCase()) ||
                    lip.artist.toLowerCase().includes(q.toLowerCase()) ||
                    lip.songTitle.toLowerCase().includes(q.toLowerCase())),
        )
    }, [lips, q])

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

    console.log(
        'IDLE',
        idleLips.map((lip) => lip.sortNumber),
    )
    console.log(
        'SELECTED',
        selectedLips.map((lip) => lip.sortNumber),
    )

    /**
     *
     * Event handling
     *
     */

    const handleLiveButtonClick = () => {
        if (!actionLip) {
            return
        }
        utils.lip.getBySessionId.setData({ id: session.id }, (prevLips) => {
            return prevLips?.map((lip) => {
                if (lip.id !== actionLip.id) {
                    return lip
                }
                return { ...lip, status: 'live' }
            })
        })
        updateLip({
            id: actionLip.id,
            status: 'live',
        })
    }

    const handleLipMove = ({
        id,
        sessionId,
        status,
        sortNumber,
    }: Pick<LipDTO, 'id' | 'sessionId' | 'status' | 'sortNumber'>) => {
        if (sortNumber === null) {
            throw new Error('Can not move a lip without a target sort number.')
        }

        const fromLip = lips.find((lip) => lip.id === id)!

        if (fromLip.status === status && fromLip.sortNumber === sortNumber) {
            return
        }

        // TODO: add this to move update to avoid having two requests
        if (actionLip && status === 'staged') {
            const actionStatus =
                actionLip.status === 'staged' ? 'no-show' : 'done'
            utils.lip.getBySessionId.setData({ id: session.id }, (prevLips) => {
                return prevLips?.map((lip) => {
                    if (lip.id !== actionLip.id) {
                        return lip
                    }
                    return { ...lip, status: actionStatus }
                })
            })
            updateLip({
                id: actionLip.id,
                status: actionStatus,
            })
        }

        // Optimistic update
        void utils.lip.getBySessionId.setData(
            { id: session.id },
            (prevLips) => {
                return prevLips
                    ?.map((lip) => {
                        if (lip.sortNumber === null) {
                            return lip
                        }
                        if (lip.id === id) {
                            return {
                                ...lip,
                                status,
                                sortNumber,
                            }
                        }
                        if (fromLip.status === status) {
                            if (lip.status !== status) {
                                return lip
                            }
                            const currentSortNumber = lip.sortNumber
                            const fromSortNumber = fromLip.sortNumber!
                            const toSortNumber = sortNumber

                            let shift = 0

                            if (currentSortNumber > fromSortNumber) {
                                if (toSortNumber >= currentSortNumber) {
                                    shift--
                                }
                            } else {
                                if (toSortNumber <= currentSortNumber) {
                                    shift++
                                }
                            }

                            return {
                                ...lip,
                                sortNumber: currentSortNumber + shift,
                            }
                        } else {
                            if (
                                lip.status === fromLip.status &&
                                lip.sortNumber > fromLip.sortNumber!
                            ) {
                                return {
                                    ...lip,
                                    sortNumber: lip.sortNumber - 1,
                                }
                            }
                            if (
                                lip.status === status &&
                                lip.sortNumber >= sortNumber
                            ) {
                                return {
                                    ...lip,
                                    sortNumber: lip.sortNumber + 1,
                                }
                            }
                        }
                        return lip
                    })
                    .sort(
                        (a, b) =>
                            (a.sortNumber ?? Infinity) -
                            (b.sortNumber ?? Infinity),
                    )
            },
        )

        // Database update
        moveLip({
            id,
            sessionId,
            status,
            sortNumber,
        })
    }

    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        if (!isLipsFetching && !isLipUpdatePending && !isLipMovePending) {
            setIsPending(false)
        }
        if (isLipUpdatePending || isLipMovePending) {
            setIsPending(true)
        }
    }, [isLipsFetching, isLipUpdatePending, isLipMovePending])

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
             * Page swap on mobile
             */

            const isMobile = window.innerWidth < MD_BREAKPOINT

            if (isMobile) {
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
             * Delete flag
             */

            let deleteOnDrop = false

            if (dragItem.status === 'idle') {
                if (isMobile) {
                    deleteOnDrop =
                        vx >
                        window.innerWidth / 2 + HORIZONTAL_DRAG_ACTION_THRESHOLD
                } else {
                    const vwHalf = window.innerWidth / 2
                    const leftCenter =
                        Math.min(vwHalf, MAX_CONTAINER_WIDTH / 2) / 2
                    deleteOnDrop =
                        vx >
                        vwHalf + leftCenter + HORIZONTAL_DRAG_ACTION_THRESHOLD
                }
            }

            /**
             * Find drag and target box
             */

            const offsetTop =
                leftScrollBoxRef.current.offsetTop +
                (isMobile
                    ? DRAG_DROP_LIST_HEADER_HEIGHT_MOBILE
                    : DRAG_DROP_LIST_HEADER_HEIGHT_DESKTOP)

            let dragBox: BoxType | undefined
            let targetBox: BoxType | undefined

            switch (dragItem.status) {
                case 'idle': {
                    dragBox = BoxType.RIGHT

                    if (mx > (-1 * dragBoxWidth) / 2) {
                        targetBox = BoxType.RIGHT
                    } else {
                        if (vy > offsetTop) {
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
                        if (vy > offsetTop) {
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

                    if (vy < offsetTop) {
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

            if (down) {
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
            } else {
                const resetSpringEffect = () => ({
                    x: 0,
                    y: 0,
                    scale: 1,
                    zIndex: 0,
                    shadow: 0,
                    immediate: true,
                })

                selectedAPI.start(resetSpringEffect)
                idleAPI.start(resetSpringEffect)
                actionAPI.start(resetSpringEffect)

                console.log('LIP ID', lipId)

                console.log('DELETE', deleteOnDrop)

                console.log('DRAG BOX', dragBox)
                console.log('TARGET BOX', targetBox)
                console.log('DRAG INDEX', dragIndex)
                console.log('TARGET INDEX', targetIndex)

                // staged - live toggle on lip
                // no moving lip away from live stack > implement no-show status

                let status: LipDTO['status'] = 'idle'

                if (deleteOnDrop) {
                    status = 'deleted' // indicate when hover
                } else if (targetBox === 'left') {
                    status = 'selected'
                } else if (targetBox === 'action') {
                    status = 'staged' // set live to done
                }

                setTimeout(() => {
                    handleLipMove({
                        id: lipId,
                        sessionId: session.id,
                        status,
                        sortNumber: targetIndex + 1,
                    })
                }, 0)

                setIsActionTarget(false)
                unlockScroll()
            }
        },
        {
            pointer: {
                capture:
                    window?.matchMedia?.('(pointer: coarse)').matches ?? false,
            },
        },
    )

    return (
        <BoxMain className='relative overflow-visible'>
            <div
                className={cn('absolute inset-0', {
                    'animate-pulse': isLipsLoading,
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
                            'flex h-dvh flex-col items-center gap-3 transition-transform duration-200 max-md:w-[100vw]',
                            {
                                'max-md:scale-95': isPageDragging,
                            },
                        )}
                    >
                        <DragDropList
                            ref={leftScrollBoxRef}
                            lips={selectedLips}
                            springs={selectedSprings}
                            bind={bindLipDrag}
                            isLocked={session.isLocked || isPending}
                            hideFavorites={session.hideFavorites ?? false}
                            fixTop={scrollTopLock && scrollTopLock[0]}
                            header={
                                <div
                                    className={cn(
                                        'relative m-auto flex h-full w-full items-center justify-center border-4 border-white/30',
                                        {
                                            'border-white': isActionTarget,
                                        },
                                    )}
                                >
                                    <Subtitle2
                                        className={cn(
                                            'absolute left-1/2 top-1/2 w-24 -translate-x-1/2 -translate-y-1/2 select-none text-white opacity-30',
                                            {
                                                'opacity-100': isActionTarget,
                                            },
                                        )}
                                    >
                                        Live Stack
                                    </Subtitle2>

                                    {actionLip && (
                                        <div className='relative w-full max-w-96'>
                                            <DragDropListItem
                                                lip={actionLip}
                                                spring={actionSpring}
                                                bind={bindLipDrag}
                                                isLocked
                                                hideTime
                                                hideFavorites
                                            />
                                            <div className='absolute right-2 top-1/2 flex h-20 w-28 -translate-y-1/2 items-center justify-center'>
                                                {actionLip.status ===
                                                    'staged' && (
                                                    <Button
                                                        variant='ghost'
                                                        onClick={
                                                            handleLiveButtonClick
                                                        }
                                                        disabled={isPending}
                                                    >
                                                        <PlayCircle className='h-14 w-14 fill-pink-700 text-black' />
                                                    </Button>
                                                )}
                                                {actionLip.status ===
                                                    'live' && (
                                                    <Radio className='h-14 w-14 fill-pink-700 text-black' />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                        />
                    </section>

                    <section
                        className={cn(
                            'flex h-dvh flex-col items-center gap-3 transition-transform duration-200 max-md:w-[100vw]',
                            {
                                'max-md:scale-95': isPageDragging,
                            },
                        )}
                    >
                        <DragDropList
                            ref={rightScrollBoxRef}
                            lips={idleLips}
                            q={q}
                            springs={idleSprings}
                            bind={bindLipDrag}
                            isLocked={session.isLocked || isPending}
                            hideFavorites={session.hideFavorites ?? false}
                            fixTop={scrollTopLock && scrollTopLock[1]}
                            header={
                                <div className='w-full max-w-96 space-y-4'>
                                    <SessionMenu
                                        session={session}
                                        isSessionPending={isPending}
                                    />

                                    <Input
                                        className='focus-visible:ring-blue-300'
                                        id='song-search'
                                        aria-label='Song search input'
                                        defaultValue={q || ''}
                                        name='q'
                                        placeholder='Search'
                                        type='search'
                                        onChange={(event) => {
                                            setQ(event.target.value)
                                        }}
                                    />
                                </div>
                            }
                        />
                    </section>

                    <div
                        {...bindPageDrag()}
                        className='absolute bottom-0 left-1/2 h-32 w-full -translate-x-1/2 touch-none select-none md:hidden'
                    />
                </div>
            </div>

            {session.isDemo && (
                <div className='absolute bottom-6 right-6'>
                    <AddDemoLipButton session={session} />
                </div>
            )}
        </BoxMain>
    )
}
