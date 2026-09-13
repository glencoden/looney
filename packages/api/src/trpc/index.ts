import { db, hasPermission, type PermissionRole } from '@repo/db'
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

type AuthUser = {
    id: string
    email: string
    name: string
    image: string | null
    permissionRole: PermissionRole
}

export const createContext = async (opts: {
    req: Request
    user: AuthUser | null
}) => {
    return { db, user: opts.user }
}

type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        }
    },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
        ctx: {
            user: ctx.user,
        },
    })
})

export const requirePermission = (role: PermissionRole) =>
    protectedProcedure.use(({ ctx, next }) => {
        if (!hasPermission(ctx.user.permissionRole, role)) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: `Your role '${ctx.user.permissionRole}' does not have permission for this action. It requires the '${role}' role.`,
            })
        }
        return next()
    })

export const hostProcedure = requirePermission('host')

export const adminProcedure = requirePermission('admin')
