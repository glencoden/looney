import { animated, SpringValue } from '@react-spring/web'
import type { LipDTO } from '@repo/api/types'
import SongLip from '@repo/ui/components/SongLip'
import { cn } from '@repo/ui/helpers'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { Radio } from 'lucide-react'

export default function DragDropListItem({
    lip,
    q,
    spring: { zIndex, shadow, x, y, scale },
    bind,
    isLocked,
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
    bind: (...args: unknown[]) => ReactDOMAttributes
    isLocked: boolean
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
        >
            <SongLip
                lip={lip}
                q={q}
                hideTime={lip.status === 'live'}
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
            {lip.status === 'live' && (
                <div className='absolute right-2 top-1/2 flex h-20 w-28 -translate-y-1/2 items-center justify-center'>
                    <Radio className='h-14 w-14 fill-pink-700 text-black' />
                </div>
            )}
        </animated.div>
    )
}
