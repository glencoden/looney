import { SpringValue } from '@react-spring/web'
import { cn } from '@repo/ui/helpers'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { forwardRef } from 'react'
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
        items: Lip[]
        springs: {
            zIndex: SpringValue<number>
            shadow: SpringValue<number>
            x: SpringValue<number>
            y: SpringValue<number>
            scale: SpringValue<number>
        }[]
        bind: (...args: any[]) => ReactDOMAttributes
        fixTop: number | null
    }
>(({ items, springs, bind, fixTop }, ref) => {
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
            {springs.map((spring, index) => {
                const item = items[index]

                if (!item) {
                    throw new Error('Expect item to be defined')
                }

                return (
                    <DragDropListItem
                        key={item.id}
                        item={item}
                        spring={spring}
                        bind={bind}
                    />
                )
            })}
        </div>
    )
})

export default DragDropList
