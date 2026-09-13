import { FeedbackPanel } from '../../_components/FeedbackPanel'

export default async function FeedbackDrawerFull({
    params,
}: {
    params: Promise<{ guestId: string }>
}) {
    const { guestId } = await params
    return <FeedbackPanel guestId={guestId} />
}
