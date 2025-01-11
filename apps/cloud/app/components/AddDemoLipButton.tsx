import { Session } from '@repo/db'
import Button from '@repo/ui/components/Button'
import { CirclePlus } from 'lucide-react'

export default function AddDemoLipButton({
    session,
}: Readonly<{ session: Session }>) {
    return (
        <Button
            variant='ghost'
            title='Add demo lip'
            // disabled={isPending}
            // onClick={handleFavoriteButtonClick}
        >
            <CirclePlus className='h-12 w-12 fill-pink-600 text-black' />
        </Button>
    )
}
