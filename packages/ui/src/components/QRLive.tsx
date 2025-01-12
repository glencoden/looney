import { cn } from '../helpers'
import qrLive from '../images/qr-code-live.png'

export default function QRLive({
    className,
}: Readonly<{ className?: string }>) {
    return <img src={qrLive} alt='QR Code' className={cn('w-40', className)} />
}
