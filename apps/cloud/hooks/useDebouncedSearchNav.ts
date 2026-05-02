'use client'

import { useRouter } from 'next/navigation'
import { useRef, useTransition } from 'react'

type Options = {
    buildUrl: (value: string) => string
    initialValue: string | null
    delay?: number
}

export function useDebouncedSearchNav({
    buildUrl,
    initialValue,
    delay = 500,
}: Options) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    )
    const hasNavigatedRef = useRef<boolean>(initialValue !== null)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
        const isFirstSearch = !hasNavigatedRef.current
        hasNavigatedRef.current = true
        timeoutIdRef.current = setTimeout(() => {
            const url = buildUrl(value)
            startTransition(() => {
                if (isFirstSearch) {
                    router.push(url)
                } else {
                    router.replace(url)
                }
            })
        }, delay)
    }

    return { onChange, isPending }
}
