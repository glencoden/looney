import { animated, SpringValue } from '@react-spring/web'
import SongLip from '@repo/ui/components/SongLip'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

type Lip = {
    id: string
    songTitle: string
    artistName: string
    singerName: string
    status: 'idle' | 'selected' | 'staged' | 'live' | 'done' | 'deleted'
    sortNumber: number
}

export default function DragDropListItem({
    item,
    spring: { zIndex, shadow, x, y, scale },
    bind,
}: {
    item: Lip
    spring: {
        zIndex: SpringValue<number>
        shadow: SpringValue<number>
        x: SpringValue<number>
        y: SpringValue<number>
        scale: SpringValue<number>
    }
    bind: (...args: any[]) => ReactDOMAttributes
}) {
    return (
        <animated.div
            className='relative w-full max-w-96'
            style={{
                zIndex,
                boxShadow: shadow.to(
                    (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
                ),
                x,
                y,
                scale,
            }}
            children={
                <>
                    <SongLip lip={item} />
                    <div
                        {...bind(item.id)}
                        className='absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 touch-none select-none'
                    />
                </>
            }
        />
    )
}
