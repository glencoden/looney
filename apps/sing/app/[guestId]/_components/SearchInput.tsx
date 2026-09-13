'use client'

import Input from '@repo/ui/components/Input'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

export function SearchInput() {
    const t = useTranslations()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()
    const [value, setValue] = useState(searchParams.get('q') ?? '')
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    )

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value
        setValue(next)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (next) {
                params.set('q', next)
            } else {
                params.delete('q')
            }
            startTransition(() => {
                router.replace(`?${params.toString()}`, { scroll: false })
            })
        }, 200)
    }

    return (
        <Input
            id='song-search'
            className='focus-visible:ring-blue-300'
            type='search'
            name='q'
            aria-label='Song search input'
            placeholder={t('search.placeholder')}
            value={value}
            onChange={onChange}
        />
    )
}
