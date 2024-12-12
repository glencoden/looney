import { useDrag } from '@use-gesture/react'
import { ReactNode, useState } from 'react'

export default function DragDropBox({ children }: { children: ReactNode }) {
    // const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)

    const bind = useDrag(({ down, movement: [mx, my] }) => {
        if (!down) {
            return
        }
        console.log(mx, my)
        setOffsetX(mx)
        setOffsetY(my)
    })

    return (
        <div
            {...bind()}
            className='relative touch-none'
            style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
        >
            {children}
        </div>
    )
}
