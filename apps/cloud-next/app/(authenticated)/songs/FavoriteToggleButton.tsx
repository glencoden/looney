'use client'

import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import { Star } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function FavoriteToggleButton({ isFavorite }: { isFavorite: boolean }) {
    const { pending } = useFormStatus()

    return (
        <Button
            variant='ghost'
            size='icon'
            className={cn('mt-[1px]', { 'animate-pulse': pending })}
            aria-label={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
            name='favorite'
            value={isFavorite ? 'false' : 'true'}
            type='submit'
            disabled={pending}
        >
            <Star
                className={cn('h-4 w-4 text-blue-700', {
                    'fill-white text-white': isFavorite,
                })}
            />
        </Button>
    )
}
