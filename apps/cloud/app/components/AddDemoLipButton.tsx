import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import Button from '@repo/ui/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@repo/ui/components/Dialog'
import { cn } from '@repo/ui/helpers'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddDemoDialogContent from '~/components/AddDemoDialogContent'

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

    const [isOpen, setIsOpen] = useState(false)

    const handleSongClick = (songId: string) => {
        if (isCreateDemoPending) {
            return
        }
        void createDemoLip({
            sessionId: session.id,
            songId,
        })
        setIsOpen(false)
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                    title='Open add demo lip dialog'
                    disabled={isPending}
                >
                    <CirclePlus
                        className={cn('h-6 w-6 text-white', {
                            'animate-spin': isPending,
                        })}
                    />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Song to the Session</DialogTitle>
                </DialogHeader>

                <AddDemoDialogContent handleSongClick={handleSongClick} />
            </DialogContent>
        </Dialog>
    )
}
