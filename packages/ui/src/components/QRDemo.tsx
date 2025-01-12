import { cn } from '../helpers'
import qrDemo from '../images/qr-code-demo.png'

export default function QRDemo({
    className,
}: Readonly<{ className?: string }>) {
    return <img src={qrDemo} alt='QR Code' className={cn('w-40', className)} />
}
