import { animated, SpringValue } from '@react-spring/web'
import { LipDTO } from '@repo/api'
import SongLip from '@repo/ui/components/SongLip'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

export default function DragDropListItem({
    lip,
    q,
    spring: { zIndex, shadow, x, y, scale },
    bind,
}: {
    lip: LipDTO
    q?: string
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
                    <SongLip lip={lip} q={q} />
                    <div
                        {...bind(lip.id)}
                        className='absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none active:cursor-grabbing'
                    />
                </>
            }
        />
    )
}
