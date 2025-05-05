import { animated, SpringValue } from '@react-spring/web'
import type { LipDTO } from '@repo/api/types'
import SongLip from '@repo/ui/components/SongLip'
import { cn } from '@repo/ui/helpers'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

export default function DragDropListItem({
    lip,
    q,
    spring: { zIndex, shadow, x, y, scale },
    bind,
    isLocked,
    hideTime,
    hideFavorites,
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
    isLocked: boolean
    hideTime?: boolean
    hideFavorites?: boolean
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
                    <SongLip
                        lip={lip}
                        q={q}
                        hideTime={hideTime}
                        hideFavorites={hideFavorites}
                    />
                    <div
                        {...bind(lip.id)}
                        className={cn(
                            'absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none active:cursor-grabbing',
                            {
                                hidden: isLocked,
                            },
                        )}
                    />
                </>
            }
        />
    )
}
