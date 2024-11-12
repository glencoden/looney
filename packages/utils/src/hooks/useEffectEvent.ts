'use client'

import { useCallback, useRef } from 'react'

/* eslint-disable */

/**
 *
 * In anticipation of https://react.dev/reference/react/experimental_useEffectEvent
 *
 * @param fn
 */
export const useEffectEvent = <T extends unknown[], R>(
    fn: (...args: T) => R,
): ((...args: T) => R) => {
    const ref = useRef<(...args: T) => R>(fn)

    ref.current = fn

    return useCallback(function (this: unknown, ...args: T) {
        return ref.current.apply(this, args)
    }, []) as (...args: T) => R
}
