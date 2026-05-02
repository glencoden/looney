export default async function GuestPage({
    params,
}: {
    params: Promise<{ guestId: string }>
}) {
    const { guestId } = await params
    return <div>guest {guestId} (placeholder)</div>
}
