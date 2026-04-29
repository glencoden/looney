import { cn } from '../helpers'
import logoWhite from '../images/logo-white.png'

const asset = logoWhite as unknown as string | { src: string }
const logoSrc = typeof asset === 'string' ? asset : asset.src

export default function Logo({ className }: Readonly<{ className?: string }>) {
    return <img src={logoSrc} alt='Logo' className={cn('w-40', className)} />
}
