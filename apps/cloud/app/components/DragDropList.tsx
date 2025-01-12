import { SpringValue } from '@react-spring/web'
import { LipDTO } from '@repo/api'
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
        bind: (...args: any[]) => ReactDOMAttributes
        isLocked: boolean
        fixTop: number | null
        header: ReactNode
    }
>(({ lips, q, springs, bind, isLocked, fixTop, header }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'px-main relative flex w-full flex-grow flex-col items-center gap-3 pb-24',
                {
                    'overflow-y-scroll': fixTop === null,
                },
            )}
            style={fixTop ? { transform: `translateY(-${fixTop}px)` } : {}}
        >
            <div
                className='sticky left-0 top-0 z-10 h-36 w-full shrink-0 bg-blue-800 max-md:w-[100vw] lg:h-40'
                style={fixTop ? { top: `${fixTop}px` } : {}}
            >
                <div className='absolute bottom-0 left-1/2 flex h-28 w-full -translate-x-1/2 items-center justify-center px-6'>
                    {header}
                </div>
            </div>

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
                    />
                )
            })}
        </div>
    )
})

export default DragDropList
