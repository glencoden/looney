'use client'

import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import { Circle } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function SetlistSongToggleButton({
    isSelected,
}: {
    isSelected: boolean
}) {
    const { pending } = useFormStatus()

    return (
        <Button
            variant='ghost'
            size='icon'
            className='mt-[1px]'
            aria-label={isSelected ? 'Remove from setlist' : 'Add to setlist'}
            name='selected'
            value={isSelected ? 'false' : 'true'}
            type='submit'
            disabled={pending}
        >
            <div className='relative h-4 w-4'>
                {pending && (
                    <Circle
                        aria-hidden
                        className={cn(
                            'absolute inset-0 h-4 w-4 animate-ping text-blue-700',
                            { 'fill-white text-white': isSelected },
                        )}
                    />
                )}
                <Circle
                    className={cn('relative h-4 w-4 text-blue-700', {
                        'fill-white text-white': isSelected,
                    })}
                />
            </div>
        </Button>
    )
}
