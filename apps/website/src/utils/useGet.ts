import { useCallback, useEffect, useState } from 'react'
import type { TJson } from '../types/TJson'

export function useGet(url: string) {
    const [data, setData] = useState<TJson | null>(null)
    const [error, setError] = useState<TJson | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const get = useCallback(async () => {
        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch(url)
            setData(await response.json())
        } catch (err) {
            setError((typeof err === 'object' ? err : { err }) as TJson)
        }

        setIsLoading(false)
    }, [url])

    useEffect(() => {
        get()
    }, [url, get])

    return { data, error, isLoading, refetch: get }
}
