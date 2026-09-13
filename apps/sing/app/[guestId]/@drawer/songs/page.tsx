import { MySongsPanel } from '../../_components/MySongsPanel'

export default async function SongsDrawerFull({
    params,
}: {
    params: Promise<{ guestId: string }>
}) {
    const { guestId } = await params
    return <MySongsPanel guestId={guestId} />
}
