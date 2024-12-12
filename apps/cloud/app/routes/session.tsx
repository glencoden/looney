import BoxMain from '@repo/ui/components/BoxMain'
import SongLip from '@repo/ui/components/SongLip'
import { cn } from '@repo/ui/helpers'
import { useDrag } from '@use-gesture/react'
import { useState } from 'react'

export default function Session() {
    // const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    const [isLeft, setIsLeft] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [offsetX, setOffsetX] = useState(0)

    const bind = useDrag(({ down, movement: [mx] }) => {
        if (!down) {
            setIsDragging(false)
            return
        }
        setIsDragging(true)
        setOffsetX(mx)
    })

    return (
        <BoxMain className='border-white-300 relative border-2'>
            <div
                className={cn(
                    'grid grid-cols-2 max-md:absolute max-md:left-0 max-md:top-0 max-md:w-[200vw]',
                    {
                        'max-md:-left-[100vw]': !isLeft,
                    },
                )}
                style={{ transform: `translateX(${offsetX}px)` }}
            >
                <section className='px-main flex h-dvh flex-col items-center gap-3 border-2 border-red-500 pt-12 max-md:w-[100vw]'>
                    <div className='border-white-500 min-h-12 w-full max-w-96 border-2'>
                        Start field
                    </div>
                    <div
                        className={cn(
                            'flex w-full flex-grow flex-col items-center gap-3 overflow-y-scroll',
                            {
                                'overflow-hidden': isDragging,
                            },
                        )}
                    >
                        <SongLip />
                    </div>
                </section>

                <section className='px-main flex h-dvh flex-col items-center gap-3 border-2 border-green-500 pt-12 max-md:w-[100vw]'>
                    <div className='border-white-500 min-h-12 w-full max-w-96 border-2'>
                        Search field
                    </div>
                    <div
                        className={cn(
                            'flex w-full flex-grow flex-col items-center gap-3 overflow-y-scroll',
                            {
                                'overflow-hidden': isDragging,
                            },
                        )}
                    >
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                        <SongLip />
                    </div>
                </section>

                <div
                    {...bind()}
                    className='absolute bottom-0 left-1/2 h-32 w-64 -translate-x-1/2 select-none border-2 border-amber-300 max-md:touch-none md:hidden'
                />
            </div>
        </BoxMain>
    )
}
