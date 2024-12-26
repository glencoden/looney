import { animated, SpringValue } from '@react-spring/web'
import SongLip from '@repo/ui/components/SongLip'
import { cn } from '@repo/ui/helpers'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { forwardRef } from 'react'

type Lip = {
    id: string
    songTitle: string
    artistName: string
    singerName: string
    status: 'pending' | 'staged' | 'live' | 'done' | 'deleted'
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
            {springs.map(({ zIndex, shadow, x, y, scale }, index) => {
                const item = items[index]

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
})

export default DragDropList
