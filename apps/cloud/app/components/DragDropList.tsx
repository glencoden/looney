import { SpringValue } from '@react-spring/web'
import { cn } from '@repo/ui/helpers'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { forwardRef, ReactNode } from 'react'
import DragDropListItem from '~/components/DragDropListItem'

type Lip = {
    id: string
    songTitle: string
    artistName: string
    singerName: string
    status: 'idle' | 'selected' | 'staged' | 'live' | 'done' | 'deleted'
    sortNumber: number
}

const DragDropList = forwardRef<
    HTMLDivElement,
    {
        lips: Lip[]
        springs: {
            zIndex: SpringValue<number>
            shadow: SpringValue<number>
            x: SpringValue<number>
            y: SpringValue<number>
            scale: SpringValue<number>
        }[]
        bind: (...args: any[]) => ReactDOMAttributes
        fixTop: number | null
        header: ReactNode
    }
>(({ lips, springs, bind, fixTop, header }, ref) => {
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
                className='sticky left-0 top-0 z-10 h-36 w-full shrink-0 bg-blue-800 max-lg:w-[100vw] lg:h-40'
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
                        spring={spring}
                        bind={bind}
                    />
                )
            })}
        </div>
    )
})

export default DragDropList
