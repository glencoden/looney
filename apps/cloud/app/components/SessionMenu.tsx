import { Link } from '@remix-run/react'
import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import Button from '@repo/ui/components/Button'
import Spinner from '@repo/ui/components/Spinner'
import { cn } from '@repo/ui/helpers'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { CircleDollarSign, House, Lock, LockOpen, Star } from 'lucide-react'

export default function SessionMenu({
    session,
    isSessionPending,
}: Readonly<{
    session: Session
    isSessionPending: boolean
}>) {
    const utils = api.useUtils()

    const { mutate: updateSession, isPending: isUpdatePending } =
        api.session.update.useMutation({
            onSettled: () => {
                void utils.session.get.invalidate({ id: session.id })
            },
        })

    const handleLockButtonClick = () => {
        void updateSession({ id: session.id, isLocked: !session.isLocked })
        void utils.session.get.setData(
            { id: session.id },
            { ...session, isLocked: !session.isLocked },
        )
    }

    const handleFavoriteButtonClick = () => {
        void updateSession({
            id: session.id,
            hideFavorites: !session.hideFavorites,
        })
        void utils.session.get.setData(
            { id: session.id },
            { ...session, hideFavorites: !session.hideFavorites },
        )
    }

    const handleTipCollectionButtonClick = () => {
        void updateSession({
            id: session.id,
            hideTipCollection: !session.hideTipCollection,
        })
        void utils.session.get.setData(
            { id: session.id },
            { ...session, hideTipCollection: !session.hideTipCollection },
        )
    }

    if (!session) {
        return (
            <div className='flex h-6 w-6 items-center justify-center'>
                <Spinner light />
            </div>
        )
    }

    const isPending = isSessionPending || isUpdatePending

    return (
        <div className='flex justify-between'>
            <section className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    title={session.isLocked ? 'Unlock session' : 'Lock session'}
                    disabled={isPending}
                    onClick={handleLockButtonClick}
                >
                    {session.isLocked ? (
                        <Lock className='h-6 w-6 text-white' />
                    ) : (
                        <LockOpen className='h-6 w-6 text-white opacity-30' />
                    )}
                </Button>

                <Button
                    variant='ghost'
                    size='icon'
                    title={
                        session.hideFavorites
                            ? 'Show favorites'
                            : 'Hide favorites'
                    }
                    disabled={isPending}
                    onClick={handleFavoriteButtonClick}
                >
                    <Star
                        className={cn('h-6 w-6 text-white opacity-30', {
                            'opacity-100': !session.hideFavorites,
                        })}
                    />
                </Button>

                <Button
                    variant='ghost'
                    size='icon'
                    title={
                        session.hideTipCollection
                            ? 'Show tip collection'
                            : 'Hide tip collection'
                    }
                    disabled={isPending}
                    onClick={handleTipCollectionButtonClick}
                >
                    <CircleDollarSign
                        className={cn('h-6 w-6 text-white opacity-30', {
                            'opacity-100': !session.hideTipCollection,
                        })}
                    />
                </Button>
            </section>

            <section className='flex items-center gap-7'>
                {isPending && <Spinner light />}
                {session.isDemo && !isPending && (
                    <Subtitle2 className='text-pink-700'>Demo</Subtitle2>
                )}

                <Button asChild variant='ghost' size='icon'>
                    <Link to='/'>
                        <House className='h-6 w-6 text-white' />
                    </Link>
                </Button>
            </section>
        </div>
    )
}
