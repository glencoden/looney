export const PERMISSION_ROLES = ['admin', 'host', 'user'] as const

export type PermissionRole = (typeof PERMISSION_ROLES)[number]

const ROLE_RANK: Record<PermissionRole, number> = {
    admin: 2,
    host: 1,
    user: 0,
}

export const isPermissionRole = (value: unknown): value is PermissionRole =>
    typeof value === 'string' &&
    (PERMISSION_ROLES as readonly string[]).includes(value)

export const hasPermission = (
    role: PermissionRole,
    required: PermissionRole,
): boolean => ROLE_RANK[role] >= ROLE_RANK[required]
