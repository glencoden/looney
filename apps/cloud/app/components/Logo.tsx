import { cn } from '@repo/ui/helpers'
import logoWhite from '~/images/logo-white.png'

export default function Logo({ className }: Readonly<{ className?: string }>) {
    return <img src={logoWhite} alt='Logo' className={cn('w-40', className)} />
}
