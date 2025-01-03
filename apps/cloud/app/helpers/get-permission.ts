import { Permission } from '~/types/Permission'

export const getPermission = (email: string | undefined): Permission => {
    if (import.meta.env.VITE_ADMIN_EMAILS.includes(email)) {
        return 'admin'
    }
    if (import.meta.env.VITE_GUEST_EMAILS.includes(email)) {
        return 'guest'
    }
    return 'none'
}
