import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import Button from '@repo/ui/components/Button'
import { CirclePlus } from 'lucide-react'

export default function AddDemoLipButton({
    session,
}: Readonly<{ session: Session }>) {
    const utils = api.useUtils()

    const { mutate: createDemoLip, isPending } = api.lip.createDemo.useMutation(
        {
            onSettled: () => {
                void utils.lip.getBySessionId.invalidate({ id: session.id })
            },
        },
    )

    const handleAddButtonClick = () => {
        void createDemoLip({ id: session.id })
    }

    return (
        <Button
            variant='ghost'
            title='Add demo lip'
            disabled={isPending}
            onClick={handleAddButtonClick}
        >
            <CirclePlus className='h-12 w-12 fill-pink-600 text-black' />
        </Button>
    )
}
