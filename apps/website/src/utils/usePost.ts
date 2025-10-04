import { useState } from 'react'
import type { TJson } from '../types/TJson'

export function usePost(url: string) {
    const [error, setError] = useState<TJson | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function post(payload: TJson) {
        setError(null)
        setIsLoading(true)

        try {
            const body = JSON.stringify(payload)
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body,
            })
            const result = await response.json()
            console.log('POST result', result)
        } catch (err) {
            setError(typeof err === 'object' ? (err as TJson) : { err })
        }

        setIsLoading(false)
    }

    return { error, isLoading, post }
}
