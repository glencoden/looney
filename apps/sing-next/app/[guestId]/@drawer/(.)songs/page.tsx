import { MySongsPanel } from '../../_components/MySongsPanel'

export default async function SongsDrawerSlot({
    params,
}: {
    params: Promise<{ guestId: string }>
}) {
    const { guestId } = await params
    return <MySongsPanel guestId={guestId} />
}
