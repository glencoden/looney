import { SpringValue } from '@react-spring/web'
import type { LipDTO } from '@repo/api/types'
import { cn } from '@repo/ui/helpers'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { forwardRef, ReactNode } from 'react'
import DragDropListItem from '~/components/DragDropListItem'

const DragDropList = forwardRef<
    HTMLDivElement,
    {
        lips: LipDTO[]
        q?: string
        springs: {
            zIndex: SpringValue<number>
            shadow: SpringValue<number>
            x: SpringValue<number>
            y: SpringValue<number>
            scale: SpringValue<number>
        }[]
        bind: (...args: unknown[]) => ReactDOMAttributes
        isLocked: boolean
        hideFavorites?: boolean
        fixTop: number | null
        header: ReactNode
    }
>(
    (
        { lips, q, springs, bind, isLocked, hideFavorites, fixTop, header },
        ref,
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'px-main relative flex w-full flex-grow flex-col items-center gap-3',
                    {
                        'overflow-y-scroll': fixTop === null,
                    },
                )}
                style={fixTop ? { transform: `translateY(-${fixTop}px)` } : {}}
            >
                <div
                    className={cn(
                        'sticky left-0 top-0 z-10 h-36 w-full shrink-0 lg:h-40',
                        {
                            absolute: fixTop !== null,
                            'px-main': fixTop !== null,
                        },
                    )}
                    style={fixTop ? { top: `${fixTop}px` } : {}}
                >
                    <div className='absolute bottom-0 left-1/2 h-64 w-full -translate-x-1/2 bg-blue-800 max-lg:w-[50vw] max-md:w-[100vw]' />
                    <div className='relative mt-8 flex h-28 w-full items-center justify-center lg:mt-12'>
                        {header}
                    </div>
                </div>
                {fixTop !== null && <div className='h-36 lg:h-40' />}

                {springs.map((spring, index) => {
                    const lip = lips[index]

                    if (!lip) {
                        throw new Error('Expect lip to be defined')
                    }

                    return (
                        <DragDropListItem
                            key={lip.id}
                            lip={lip}
                            q={q}
                            spring={spring}
                            bind={bind}
                            isLocked={isLocked}
                            hideFavorites={hideFavorites}
                        />
                    )
                })}
            </div>
        )
    },
)

DragDropList.displayName = 'DragDropList'

export default DragDropList
