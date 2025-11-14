import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import Button from '@repo/ui/components/Button'
import { cn } from '@repo/ui/helpers'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AddDemoLipButton({
    session,
}: Readonly<{ session: Session }>) {
    const { isFetching } = api.lip.getBySessionId.useQuery({
        id: session.id,
    })

    const utils = api.useUtils()

    const { mutate: createDemoLip, isPending: isCreateDemoPending } =
        api.lip.createDemo.useMutation({
            onSettled: () => {
                void utils.lip.getBySessionId.invalidate({ id: session.id })
            },
        })

    const handleAddButtonClick = () => {
        // void createDemoLip({ id: session.id })
    }

    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        if (!isFetching && !isCreateDemoPending) {
            setIsPending(false)
        }
        if (isCreateDemoPending) {
            setIsPending(true)
        }
    }, [isFetching, isCreateDemoPending])

    return (
        <Button
            variant='ghost'
            size='icon'
            title='Add demo lip'
            disabled={isPending}
            onClick={handleAddButtonClick}
        >
            <CirclePlus
                className={cn('h-6 w-6 text-white', {
                    'animate-spin': isPending,
                })}
            />
        </Button>
    )
}
