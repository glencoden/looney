import { config } from '@react-spring/web'

export const createSpringsCallback = (
    active = false,
    activeIndex = 0,
    targetIndex = 0,
    mx = 0,
    my = 0,
) => {
    return (index: number) => {
        if (active && index === activeIndex) {
            return {
                x: mx,
                y: my,
                scale: 1.07,
                zIndex: 1,
                shadow: 15,
                immediate: (key: string) => key === 'zIndex',
                config: (key: string) =>
                    key === 'x' || key === 'y' ? config.stiff : config.default,
            }
        }

        let shift = 0

        if (active) {
            if (index > activeIndex) {
                if (targetIndex >= index) {
                    shift--
                }
            } else {
                if (targetIndex <= index) {
                    shift++
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
