import { Permission } from '@repo/db'

export const hasAccess = (
    role: Permission['role'] | null | undefined,
    threshold: Permission['role'] | null = null,
) => {
    if (!role) {
        return false
    }

    if (role === 'guest') {
        return threshold === null || threshold === 'guest'
    }

    if (role === 'host') {
        return (
            threshold === null || threshold === 'guest' || threshold === 'host'
        )
    }

    if (role === 'admin') {
        return (
            threshold === null ||
            threshold === 'guest' ||
            threshold === 'host' ||
            threshold === 'admin'
        )
    }
}
