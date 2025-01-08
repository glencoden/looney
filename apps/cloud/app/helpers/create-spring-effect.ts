import { config } from '@react-spring/web'

export const createSpringEffect = (
    active = false,
    dragItemIndex = -1,
    targetIndex = -1,
    mx = 0,
    my = 0,
) => {
    return (index: number) => {
        if (active && index === dragItemIndex) {
            return {
                x: mx,
                y: my,
                scale: 1.07,
                zIndex: 20,
                shadow: 15,
                immediate: (key: string) => key === 'zIndex',
                config: (key: string) =>
                    key === 'x' || key === 'y' ? config.stiff : config.default,
            }
        }

        let shift = 0

        // No dragItemIndex but a targetIndex means the drag item is from a sibling drag-drop list
        // A dragItemIndex but no targetIndex means the drag item from the current list has been moved above a sibling list
        if (active) {
            if (dragItemIndex === -1 && targetIndex !== -1) {
                if (index >= targetIndex) {
                    shift++
                }
            } else {
                if (index > dragItemIndex) {
                    if (targetIndex >= index || targetIndex === -1) {
                        shift--
                    }
                } else {
                    if (targetIndex <= index && targetIndex !== -1) {
                        shift++
                    }
                }
            }
        }

        return {
            x: 0,
            y: shift * 108,
            scale: 1,
            zIndex: 0,
            shadow: 0,
            immediate: false,
        }
    }
}
